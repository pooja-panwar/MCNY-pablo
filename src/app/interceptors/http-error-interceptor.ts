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
import { UserService } from '../providers/user.service';
import { UserDataService } from '../providers/user-data.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    public common: CommonService,
    private router: Router,
    private user: UserDataService,
    private userService: UserService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.common.displayLoader();

    let userToken = '';
    if (this.user.userData && this.user.userData.token) {
      userToken = this.user.userData.token;
    }

    let headers = {};
    if (userToken) {
      headers = {
        Authorization: `Bearer ${userToken}`,
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
        this.handleError(error);
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
        //setTimeout(() => {
          this.common.hideLoader();
       // }, 1000);
      })
    );
  }

  //handle error response
  handleError(err) {
    this.common.presentToast(err.error.message);
    if (err.status === 401) {
      this.logoutUser();
    } else if (err.err.message === 'Token is not valid') {
      this.logoutUser();
    } else if (err.err.message === 'email already exists') {
      this.common.presentToast('Email already exists. Please login!');
      setTimeout(() => {
        this.router.navigate(['login']);
      }, 5000);
      return throwError(err);
    }
  }

  //logout user from app
  logoutUser() {
    this.userService.logout();
  }
}
