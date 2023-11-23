// common/error.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(err: any, req: Request, res: Response, next: NextFunction): any {
    console.error(err.stack);
    res.status(500).json({
      error: {
        message: 'Internal Server Error',
      },
    });
  }
}
