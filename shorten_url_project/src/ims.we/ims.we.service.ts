import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from '../urls/entities/url.entity';
import { Repository } from 'typeorm';
import { GetOriginalUrlDto } from '../urls/dto/get-original-url.dto';

@Injectable()
export class ImsWeService {
  @InjectRepository(Url)
  private urlsRepository: Repository<Url>;

  async findOriginalUrl(imsShortenedUrl: string): Promise<string> {
    const originalUrl = await this.urlsRepository.find({
      select: ['original_url'],
      where: { shortened_url: imsShortenedUrl, ...GetOriginalUrlDto },
    });
    return originalUrl[0]['original_url'];
  }
}
