import { Injectable } from '@angular/core';
import { CallHttpService } from './call-http.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiEndPoints } from './constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  signUpMasterDataSubject = new BehaviorSubject(null);

  constructor(private http: CallHttpService) {}

  /**
   *
   * @param body new user credentials
   */
  loginUser(body): Observable<any> {
    return this.http.postHttp(ApiEndPoints.LOGIN, body);
  }

  /**
   * getuser profile details
   * @param userId loggedIn user id
   */
  getUserProfile(userId): Observable<any> {
    return this.http.getHttp(ApiEndPoints.GETUSERPROFILE);
  }

  /**
   * register user after signup2 page
   * @param body user deatils for registration
   */
  registerUser(body): Observable<any> {
    return this.http.postHttp(ApiEndPoints.REGISTER, body);
  }

  verifyUserEmail(body): Observable<any> {
    return this.http.postHttp(ApiEndPoints.VERIFY_EMAIL, body);
  }

  /**
   * get masterdata for signup fields
   */
  getSignUpMasterData(): Observable<any> {
    return this.http.getHttp(ApiEndPoints.GETMASTERDATA);
  }

  /**
   * emit signup master data behaviour subject
   */
  emitMasterData(data) {
    this.signUpMasterDataSubject.next(data);
  }
}
