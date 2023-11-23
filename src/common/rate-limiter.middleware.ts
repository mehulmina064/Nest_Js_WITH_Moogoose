import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 1,
  });

  async use(req: Request, res: Response, next: NextFunction) {
    const key = req.ip;
    try {
      await this.rateLimiter.consume(key);
      next();
    } catch (e) {
      res.status(429).send('Too Many Requests');
    }
  }
}
