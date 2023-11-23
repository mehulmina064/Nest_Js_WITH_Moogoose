import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    try {
      // Pass control to the next middleware or route handler
      next();
    } catch (error) {
      // Log the error
      console.error('An error occurred:', error);

      // Handle different types of errors
      if (error instanceof HttpException) {
        // If it's an HttpException, retrieve the status and message
        const statusCode = error.getStatus();
        const message = error.message || 'Internal Server Error';

        res.status(statusCode).json({
          status: statusCode,
          message: message,
        });
      } else {
        // For unexpected errors, send a generic 500 Internal Server Error
        const statusCode = 500;
        res.status(statusCode).json({
          status: statusCode,
          message: 'Internal Server Error',
        });
      }
    }
  }
}
