import { Controller, Get, Res, Redirect, Param } from '@nestjs/common';
import { ImsWeService } from './ims.we.service';
import { Response } from 'express';

@Controller('')
export class ImsWeController {
  constructor(private readonly imsWeService: ImsWeService) {}

  @Get(':shortenedUrl')
  @Redirect('', 302)
  async redirect(
    @Param('shortenedUrl') shortenedUrl: string,
    @Res() res: Response,
  ): Promise<object> {
    try {
      /**
       * ngrockDomain/randomString 에서 randomString으로
       * redirect 타겟 originalUrl을 찾습니다.
       */
      const original_url: string =
        await this.imsWeService.findOriginalUrl(shortenedUrl);
      return { url: original_url };
    } catch (err) {
      console.error(err);
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || 'Internal Server Error' });
    }
  }
}
