import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as process from 'process';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private rateLimiter = new RateLimiterMemory({
    /**
     * 같은 ip 에서 24시간 동안 10번만
     */
    points: 10,
    duration: 86400,
  });
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader: string = req.headers['authorization'];

    try {
      if (authHeader) {
        /**
         * Bearer token(:string) 을 잘라서 token 만 뽑아 냅니다.
         */
        const token: string = authHeader.split(' ')[1];

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
          if (err) {
            console.error(err);
            return res.status(401).json({ message: 'Invalid token' });
          }
          /**
           * user_id 를 decode 해서 req 에 붙입니다.
           */
          req['userId'] = decoded['id'];
          req['isGuest'] = false as const;
          next();
        });
      } else {
        req['isGuest'] = true as const;
        await this.handleRateLimit(req, res, next);
      }
    } catch (err) {
      console.error(err);
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || 'Internal Server Error' });
    }
  }
  private async handleRateLimit(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const key: string = req.ip;
      await this.rateLimiter.consume(key);
      next();
    } catch (err) {
      res.status(429).json({
        error: 'Rate limit exceeded',
        details:
          'Too many requests from your IP. 10 times per 24 hours is the limit. Please sign in to use our service without restrict',
      });
    }
  }
}
