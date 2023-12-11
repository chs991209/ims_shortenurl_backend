import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { AuthMiddleware } from '../auth/auth.middleware';
import { Response } from 'express';
import { HttpCode } from '@nestjs/common';
import { CreateQrCodeDto } from './dto/create-qrcode';

@Controller('url')
@UseGuards(AuthMiddleware)
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @HttpCode(201)
  @Post()
  async create(
    /**
     * original_url로 shortened_url을,
     * shortened_url로 qr_code DataURL 을 만듭니다.
     */
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<object> {
    try {
      if (req['isGuest']) {
        /**
         * Guest는 즉시 단일 object가 포함된 res.body를 응답으로 받습니다.
         */
        return res.json({
          message: 'POST_SUCCESS',
          url: await this.urlsService.createGuest(createUrlDto),
          remainingPoints: req['remainingPoints'],
        });
      }
      const userId: number = req['userId'];
      /**
       * 로그인한 사용자는 생성된 data가 db에 저장된 후 생성된 db data로 구성된 object를 응답으로 받습니다.
       */
      return res.json({
        message: 'POST_SUCCESS',
        url: await this.urlsService.create(createUrlDto, userId),
        remainingPoints: '무제한',
      });
    } catch (err) {
      console.error(err);
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || 'Internal Server Error' });
    }
  }
  @HttpCode(201)
  @Post('/qrcode')
  async createQrCode(
    @Body() createQrCodeDto: CreateQrCodeDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<object> {
    try {
      if (req['isGuest']) {
        const qrCodeData: object =
          await this.urlsService.createQrCode(createQrCodeDto);
        return res.json({
          message: 'POST_SUCCESS',
          qr_code: qrCodeData,
        });
      }
      const user_id: number = req['userId'];
      const foundQrCode: object = await this.urlsService.findOneQrCode(
        createQrCodeDto,
        user_id,
      );
      return res.json({ message: 'POST_SUCCESS', qr_code: foundQrCode });
    } catch (err) {
      console.error(err);
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || 'Internal Server Error' });
    }
  }
  @HttpCode(200)
  @Get('')
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<object | void> {
    try {
      const user_id: number = req['userId'];
      if (!req['isGuest']) {
        const urls = await this.urlsService.findAllUrls(user_id);
        return res.json({ message: 'GET_SUCCESS', urls: urls });
      }
      /**
       * Guest의 browser가 로그인 페이지로 가도록 지정된 message를 담아 응답합니다..
       * Authheader의 부재 => message를 res.body에 담아 응답 => 'https://ipaddress:port/user/login'
       */
      return res.json({ message: 'Authheader does not exist' });
    } catch (err) {
      console.error(err);
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || 'Internal Server Error' });
    }
  }
}
