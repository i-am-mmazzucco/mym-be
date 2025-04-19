import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';
    let validationErrors: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        if ((exceptionResponse as any).error === 'Bad Request') {
          validationErrors = this.extractValidationErrors(exceptionResponse);
        }
      } else {
        message = exceptionResponse as string;
      }
    }

    this.logger.error(
      `HTTP Exception: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: validationErrors.length > 0 ? validationErrors : message,
    });
  }

  private extractValidationErrors(exceptionResponse: any): string[] {
    if (Array.isArray(exceptionResponse.message)) {
      return exceptionResponse.message.map((err) => {
        if (typeof err === 'string') return err;
        return Object.values(err.constraints).join(', ');
      });
    }
    return [exceptionResponse.message];
  }
}
