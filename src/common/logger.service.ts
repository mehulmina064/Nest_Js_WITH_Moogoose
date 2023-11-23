// common/logger.service.ts
import { Injectable, Logger as NestLogger } from '@nestjs/common';

@Injectable()
export class Logger {
  private readonly logger = new NestLogger();

  log(message: string): void {
    this.logger.log(message);
  }

  error(message: string, trace: string): void {
    this.logger.error(message, trace);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  debug(message: string): void {
    this.logger.debug(message);
  }

  verbose(message: string): void {
    this.logger.verbose(message);
  }
}
