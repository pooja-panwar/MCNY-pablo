import { Injectable } from '@angular/core';
import { CallHttpService } from './call-http.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiEndPoints } from './constants/api-endpoints';
import { CommonService } from './global.service';
import { Router } from '@angular/router';
import { UserDataService } from './user-data.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  signUpMasterDataSubject = new BehaviorSubject(null);

  constructor(
    private http: CallHttpService,
    private common: CommonService,
    private userDataService: UserDataService,
    // private router: Router,
    private navCtrl: NavController
  ) {}

  /**
   *
   * @param body new user credentials
   */
  loginUser(body): Observable<any> {
    return this.http.postHttp(ApiEndPoints.LOGIN, body);
  }

  /**
   * getuser profile details
   */
  getUserProfile(): Observable<any> {
    return this.http.getHttp(ApiEndPoints.GETUSERPROFILE);
  }

  /**
   * register user after signup2 page
   * @param body user deatils for registration
   */
  registerUser(body): Observable<any> {
    return this.http.postHttp(ApiEndPoints.REGISTER, body);
  }

  /**
   * check in first page if same email or phone number exists in record
   * @param body user deatils with email and phone number
   */
  uniqueDoctorCheck(body): Observable<any> {
    return this.http.postHttp(ApiEndPoints.ISUNIQUEDOCTOR, body);
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

  /**
   * send email to user who has forgot email
   * @param body form body containing user email
   */
  forgotPassword(body): Observable<any> {
    return this.http.postHttp(ApiEndPoints.FORGOT_PASSWORD, body);
  }

  /**
   * reser user password
   * @param body containing OTP and new password
   */
  resetPassword(body): Observable<any> {
    return this.http.postHttp(ApiEndPoints.RESET_PASSWORD, body);
  }

  /**
   * update doctor profile
   * @param data updated form data for doctor
   */
  editDoctorProfile(data): Observable<any> {
    return this.http.postHttp(ApiEndPoints.EDIT_DOCTOR_PROFILE, data);
  }

  //logout user from app and hit api
  userLogout(): Observable<any> {
    return this.http.getHttp(ApiEndPoints.LOGOUT);
  }

  //logout user and delete local stored details of the
  logout() {
    this.common.removeFromLocal('rememberMe');
    this.common.removeFromLocal('userData');
    this.common.menuCtrl.toggle();
    this.navCtrl.navigateForward(['login']);
    this.userDataService.setUserData();
  }

  //get county based on zipcode
  getCountyByZip(zipcode) {
    return this.http.getHttp(`${ApiEndPoints.GET_COUNTY}/${zipcode}/counties`);
  }
}
