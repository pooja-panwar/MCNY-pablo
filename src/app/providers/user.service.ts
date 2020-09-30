import { Injectable } from '@angular/core';
import { CallHttpService } from './call-http.service';
import { Observable } from 'rxjs';
import { ApiEndPoints } from './constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: CallHttpService) {}

  /**
   *
   * @param formData new user credentials
   */
  loginUser(formData): Observable<any> {
    return this.http.postHttp(ApiEndPoints.LOGIN, formData);
  }

  /**
   * getuser profile details
   * @param userId loggedIn user id
   */
  getUserProfile(userId): Observable<any> {
    return this.http.getHttp(ApiEndPoints.GETUSERPROFILE);
  }
}
