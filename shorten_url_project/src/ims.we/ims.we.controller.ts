import { Controller, Get, Res, Redirect, Param } from '@nestjs/common';
import { ImsWeService } from './ims.we.service';
import { Response } from 'express';

@Controller('ims.we')
export class ImsWeController {
  constructor(private readonly imsWeService: ImsWeService) {}

  @Get(':shortenedUrl')
  @Redirect('', 302)
  async redirect(
    @Param('shortenedUrl') shortenedUrl: string,
    @Res() res: Response,
  ): Promise<object | number | void> {
    try {
      const imsShortenedUrl: string = 'ims.we/' + shortenedUrl;
      const original_url: string =
        await this.imsWeService.findOne(imsShortenedUrl);
      return { url: original_url };
    } catch (err) {
      console.error(err);
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || 'Internal Server Error' });
    }
  }
}
