import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const body = exception.getResponse() as any;
      const message = typeof body === 'string' ? body : body.message;
      return res.status(exception.getStatus()).json({
        error: Array.isArray(message) ? message.join('; ') : message,
      });
    }

    const status = (exception as any)?.status ?? (exception as any)?.statusCode;
    if (typeof status === 'number' && status >= 400 && status < 500) {
      return res.status(status).json({ error: (exception as any).message });
    }

    this.logger.error(exception);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Внутренняя ошибка сервера' });
  }
}
