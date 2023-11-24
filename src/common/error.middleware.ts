/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, HttpException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    try {
    //   console.error('in ErrorMiddleware');
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
      } else if (error instanceof MongoServerError && error.code === 11000) {
        // If it's a MongoServerError with duplicate key error, handle it accordingly
        const statusCode = 400; // You might want to use a different status code like 409 Conflict
        res.status(statusCode).json({
          status: statusCode,
          message: 'Duplicate key error. The provided data violates a unique constraint.',
        });
      } 
      else if (error instanceof UnauthorizedException) {
        const statusCode = error.getStatus();
        const message = error.message || 'Unauthorized';
        console.error(`Unauthorized request: ${message}`);
        res.status(statusCode).json({
          status: statusCode,
          message: message,
        });
        return;
      }else {
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
