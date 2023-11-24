/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
// common/session.guard.ts

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  private readonly rateLimiter = new RateLimiterMemory({
    points: 60,         
    duration: 60,  
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log("user in session guard started");
    const request = context.switchToHttp().getRequest();
    //rate limiting Logic
    const clientIp = request.ip;
    const rateLimiterKey = `rateLimiter_key_${clientIp}`;
    
    try {
        await this.rateLimiter.consume(rateLimiterKey);
      } catch (e) {
        throw new UnauthorizedException('Too many requests. Please try again later.');
      }

    const user = request.user;
    if (user.isDeleted) {
      throw new UnauthorizedException('Your account was deleted. Please contact the administrator.');
    }
    const { currentSessionToken, sessionToken } = user;
    if (!sessionToken || !currentSessionToken) {
      throw new UnauthorizedException('Missing session token in User');
    }
    // console.log("user in session guard end", sessionToken, currentSessionToken);
    if (currentSessionToken !== sessionToken) {
      throw new UnauthorizedException('Invalid session token. You have reached the maximum number of devices - One device at a time. Please log in again.');
    }
    return true;
  }

}
