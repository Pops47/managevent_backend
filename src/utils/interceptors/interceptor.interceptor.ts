import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface Response<T> {
  data: T;
}

@Injectable()
export class Interceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        date: new Date(Date.now()).toISOString(),
        data,
      })),
      catchError((err) => {
        const response = {
          status: err.status,
          date: new Date(Date.now()).toISOString(),
          message: err.message,
          error: err,
        };
        throw new HttpException(response, err.status);
      }),
    );
  }
}
