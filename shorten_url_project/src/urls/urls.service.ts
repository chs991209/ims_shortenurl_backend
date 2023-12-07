import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as qrcode from 'qrcode';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './entities/url.entity';
import { GetUrlDto } from './dto/get-url.dto';
import { CreateQrCodeDto } from './dto/create-qrcode';
import { promisify } from 'util';

@Injectable()
export class UrlsService {
  // Dependency를 분리해서 Testcode 시에 module mock화가 가능해 진다.
  private readonly qrcode: typeof qrcode;
  constructor(
    @InjectRepository(Url)
    private urlsRepository: Repository<Url>,
  ) {
    this.qrcode = qrcode;
  }

  async create(createUrlDto: CreateUrlDto, user_id: number): Promise<object> {
    /**
     * CreateUrlDto로 original_url의 data type을 검증합니다.
     * response body로 보낼 url은 단수의 데이터입니다.
     */
    const shortened_url: string = this.generateShortenedUrl();
    const qr_code: string = await this.generateQrCode(shortened_url);
    const url: Url = this.urlsRepository.create({
      ...createUrlDto,
      shortened_url,
      qr_code,
      user_id,
    });
    await this.urlsRepository.save(url);
    /**
     * 사용자는 shortened_url을 먼저 제공받습니다. qr_code는 QrCode 생성 요청 시에만 응답에 포함해 보냅니다.
     */
    const savedData: Url[] = await this.urlsRepository.find({
      select: ['id', 'original_url', 'shortened_url', 'created_at'],
      where: { id: url.id },
    });
    const formattedQrCode = savedData.map((urlData) => ({
      ...urlData,
      created_at: this.formatToKoreanTime(urlData['created_at'] as Date),
    }));
    return formattedQrCode;
  }
  async createGuest(createUrlDto: CreateUrlDto): Promise<object> {
    /**
     * CreateUrlDto로 original_url의 data type을 검증합니다.
     * response body로 보낼 url은 단수의 데이터입니다.
     */
    const shortened_url: string = this.generateGuestShortenedUrl();
    /**
     * 사용자는 shortened_url을 먼저 제공받습니다. qr_code는 QrCode 생성 요청 시에만 응답에 포함해 보냅니다.
     */
    const koreanTimestamp = await this.getCurrentKoreanTimestamp();

    const response: object = {
      shortened_url: shortened_url,
      created_at: koreanTimestamp,
      ...createUrlDto,
    };
    return response;
  }

  /**
   * null 인 key를 제거해서 보냅니다.
   */
  // null key 제거 버전
  async findAllUrls(
    getUrlDto: GetUrlDto,
    user_id: number,
  ): Promise<Record<string, object>[]> {
    const filterOptions: Record<string, object> = {};
    Object.keys(getUrlDto).forEach((key) => {
      if (getUrlDto[key] !== null && getUrlDto[key] !== undefined) {
        filterOptions[key] = getUrlDto[key];
      }
    });

    const urls: Url[] = await this.urlsRepository.find({
      select: [
        'id',
        'original_url',
        'shortened_url',
        'created_at',
        'deleted_at',
      ],
      where: { user_id: user_id, ...filterOptions },
    });
    /**
     * deleted_at이 null일 떄 deleted_at key 자체를 forEach에서 생성하지 않고 res에 담아서 보냅니다.
     */
    const filteredUrls = urls.map((url) => {
      const filteredUrl: Record<string, object> = {};
      Object.keys(url).forEach((key) => {
        if (url[key] !== null && url[key] !== undefined) {
          filteredUrl[key] =
            key === 'deleted_at' ? this.formatToKoreanTime(url[key]) : url[key];
        }
      });
      return filteredUrl;
    });

    return filteredUrls;
  }

  async createQrCode(createQrCodeDto: CreateQrCodeDto): Promise<object> {
    const koreanTimestamp: string = await this.getCurrentKoreanTimestamp();
    return {
      ...createQrCodeDto,
      qr_code: await this.generateQrCode(createQrCodeDto.shortened_url),
      created_at: koreanTimestamp,
    };
  }

  async findOneQrCode(
    createQrCodeDto: CreateQrCodeDto,
    user_id: number,
  ): Promise<object> {
    const qr_code: Url[] = await this.urlsRepository.find({
      select: ['id', 'shortened_url', 'qr_code', 'created_at'],
      where: { shortened_url: createQrCodeDto.shortened_url, user_id: user_id },
    });
    const formattedQrCode = qr_code.map((urlData) => ({
      ...urlData,
      created_at: this.formatToKoreanTime(urlData['created_at'] as Date),
    }));
    return formattedQrCode;
  }

  private generateShortenedUrl(): string {
    const randomString: string = Math.random().toString(24).substring(4);
    return `ims.we/${randomString}`;
  }

  private generateGuestShortenedUrl(): string {
    const randomString: string = Math.random().toString(24).substring(4);
    return `ims.we/guest/${randomString}`;
  }

  /**
   * Multiple 한 url 들을 qrcode 로 변환해 주는 함수로 바꿀 때는 Promise.all() 이 처리 속도를 높일 수 있다.
   */
  private async generateQrCode(originalUrl: string): Promise<string> {
    const toDataURLAsync = promisify<string, string>(this.qrcode.toDataURL);
    const [qrCodeDataUrl] = await Promise.all([toDataURLAsync(originalUrl)]);
    return qrCodeDataUrl;
  }
  /**
   * 현재 한국 시간을 timestamp string으로 반환합니다.
   */
  private async getCurrentKoreanTimestamp(): Promise<string> {
    const koreanOptions = {
      timeZone: 'Asia/Seoul',
      year: 'numeric' as const,
      month: '2-digit' as const,
      day: '2-digit' as const,
      hour: '2-digit' as const,
      minute: '2-digit' as const,
      second: '2-digit' as const,
    };

    const date = new Date();
    const formatter = new Intl.DateTimeFormat('ko-KR', koreanOptions);

    const parts = formatter.formatToParts(date);
    const formattedTimestamp = parts
      .map((part) =>
        part.type === 'literal' || part.type === 'fractionalSecond'
          ? part.value
          : part.value.padStart(2, '0'),
      )
      .join('');

    return formattedTimestamp;
  }

  /**
   * Date 타입의 timestamp를 한국 시간 형식으로 바꿔 줍니다.
   * example => '2023. 12. 07. 오전 10:07:07'
   */
  private formatToKoreanTime(timestamp: Date): string {
    const koreanOptions = {
      timeZone: 'Asia/Seoul',
      year: 'numeric' as const,
      month: '2-digit' as const,
      day: '2-digit' as const,
      hour: '2-digit' as const,
      minute: '2-digit' as const,
      second: '2-digit' as const,
      hour12: true,
    };

    const formatter = new Intl.DateTimeFormat('ko-KR', koreanOptions);
    return formatter.format(timestamp);
  }

  /**
   * url 여러 개를 qr_code 여러 개로 변환하는 method는 다음과 같다.
   * private async generateQrCodes(originalUrls: string[]): Promise<string[]> {
   *   const toDataURLAsync = promisify<string, string>(qrcode.toDataURL);
   *   const qrCodePromises = originalUrls.map((url) => toDataURLAsync(url));
   *
   *   try {
   *     const qrCodeDataUrls = await Promise.all(qrCodePromises);
   *     return qrCodeDataUrls;
   *   } catch (error) {
   *     console.error('Error generating QR codes:', error);
   *     throw error;
   *   }
   * }
   */
}
