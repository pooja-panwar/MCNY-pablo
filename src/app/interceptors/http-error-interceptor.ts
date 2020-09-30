import { catchError, tap } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CommonService } from '../providers/global.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(public common: CommonService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.common.displayLoader();
    return next.handle(request).pipe(
      tap((data) => console.log(data)),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(error);
          console.error(
            `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`
          );
        }
        // return an observable with a user-facing error message
        return throwError(error);
      }),
      finalize(() => {
        console.log('<<<<<<<<<<final>>>>>>>');
        // setTimeout(() => {
        this.common.hideLoader();
        // }, 1000);
      })
    );
  }
}
