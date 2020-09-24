import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';
import { CommonService } from './global.service';
import { Router } from '@angular/router';

/**
 * Service: ajax get, post methods and error handling for apis
 */
@Injectable({
  providedIn: 'root'
})
export class CallHttpService {
  httpOptions;
  constructor(
    private http: HttpClient,
    private common: CommonService,
    private router: Router,
  ) {
    this.httpOptions = {
      headers: new HttpHeaders()
    };
  }

  /**
   * http call with get method
   * @param url : url to call
   * @param isHeader : true/false
   */
  getHttp(url, isHeader = false): Observable<any> {
    if (isHeader ) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer token`
        })
      };
      return this.http.get(url, httpOptions).pipe(
        catchError(this.handleError('get request error'))
      )
    } else {
      return this.http.get(url).pipe(
        catchError(this.handleError('get request error'))
      )
    }
  }

  /**
   * http call with post method
   * @param url : url to call
   * @param param : request param
   * @param isHeader : true/false
   */
  postHttp(url, param, isHeader = false): Observable<any> {
    if (isHeader ) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer token`
        })
      };
      return this.http.post(url, param, httpOptions)
        .pipe(
          catchError(this.handleError('post request error', param))
      )
    } else {
      return this.http.post(url, param)
        .pipe(
          catchError(this.handleError('post request error', param))
      )
    }
  }

  /**
   * Error handling of http call 
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(typeof error.error.message);
      this.log(`${operation} failed: ${error.message}`);
      let errorMsg;
      if (error.error.message && typeof error.error.message == "string") {
        errorMsg = error.error.message;
      } else if (error.error.message && typeof error.error.message == "object") {
        for (const [key, value] of Object.entries(error.error.message)) {
          errorMsg = value;
        }
      } else {
        errorMsg = error.message;
      }
      this.common.presentToast(errorMsg);
      if (errorMsg == 'Unauthenticated.' || errorMsg == 'Unauthorised User.') {
        this.router.navigate(['login']);
      }
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }

  /**
   * get OS layer data
   * @param url :OS map api
   */
  getOSMapData(url) {
    this.httpOptions['responseType'] = 'text';
    return this.http.get(url, this.httpOptions);
  }
}
