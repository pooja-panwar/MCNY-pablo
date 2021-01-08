import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
//import 'rxjs/add/operator/mergeMap'
import { mergeMap } from "rxjs/operators"; 
//import 'rxjs/add/operator/mergeMap';
import { catchError } from 'rxjs/internal/operators';
import { CommonService } from './global.service';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx'

//import { saveAs } from 'file-saver';

/**
 * Service: ajax get, post methods and error handling for apis
 */
@Injectable({
  providedIn: 'root'
})
export class CallHttpService {
  httpOptions;
  path: string = '';

  constructor(
    private http: HttpClient,
    private common: CommonService,
    private router: Router,
    private file: File,
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
  getHttp(url): Observable<any> {
    return this.http.get(url).pipe(
      catchError(this.handleError('get request error'))
    )
    
  }

  /**
   * http call with get method
   * @param url : url to call
   * @param isHeader : true/false
   */
  getHttpVCF(url, inquiryFileName, path): Observable<any> {
    
    // this.path = this.file.documentsDirectory;
    console.log('path>>>>>', path);
    return this.http.get(url, {responseType: 'blob'}).pipe(mergeMap(((data: Blob) => {return from(this.file.writeFile(path, inquiryFileName, data, {replace: true}))
    })));
 }

  /**
   * http call with post method
   * @param url : url to call
   * @param param : request param
   */
  postHttp(url, param): Observable<any> {
    return this.http.post(url, param)
      .pipe(
        catchError(this.handleError('post request error', param))
    )
  }

  /**
   * http call with PUT method
   * @param url : url to call
   * @param param : request param
   */
  putHttp(url, param = {}): Observable<any> {
    return this.http.put(url, param)
      .pipe(
        catchError(this.handleError('post request error', param))
    )
  }

  /**
   * Error handling of http call 
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
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

}
