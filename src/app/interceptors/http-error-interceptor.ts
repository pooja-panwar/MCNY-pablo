import { catchError, tap, finalize } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CommonService } from '../providers/global.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(public common: CommonService, private router: Router) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.common.displayLoader();
    let userToken = localStorage.getItem('userData');
    let headers = {};
    if (userToken) {
      headers = {
        Authorization: `Bearer ${JSON.parse(userToken).token}`,
      };
    } else {
      headers = {
        Authorization: 'Bearer',
      };
    }

    const req = request.clone({
      setHeaders: headers,
    });

    return next.handle(req).pipe(
      tap((data) => console.log(data)),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error.error);
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          // console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          // console.log(error);
          console.error(
            `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`
          );
        }
        // return an observable with a user-facing error message
        return throwError(error);
      }),
      finalize(() => {
        // setTimeout(() => {
        this.common.hideLoader();
        // }, 1000);
      })
    );
  }

  //handle error response
  handleError(err) {
    if (err.message === 'Token is not valid') {
      this.common.logout();
    } else if (err.message === 'email already exists') {
      setTimeout(() => {
        this.router.navigate(['login']);
      }, 5000);
      return throwError(err);
    }
  }
}
