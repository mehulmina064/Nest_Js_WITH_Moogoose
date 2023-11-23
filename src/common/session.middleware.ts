import { Injectable, NestMiddleware } from '@nestjs/common';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: any, res: any, next: () => void) {
    return session({
      secret: this.configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })(req, res, next);
  }
}
