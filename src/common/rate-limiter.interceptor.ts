import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  private rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 1,
  });

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        const request = context.switchToHttp().getRequest();
        const key = request.ip;
        await this.rateLimiter.consume(key);
      }),
    );
  }
}
