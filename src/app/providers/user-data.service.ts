import { Injectable } from '@angular/core';
import { CommonService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  public userData: User;
  constructor(private common: CommonService) {
    this.common.getFromLocal('userData').then((val) => {
      if (val && JSON.parse(val)) {
        const user = JSON.parse(val);
        this.userData = new User(
          user.doctor.name,
          user.doctor.phoneNumber,
          user.doctor.profile_image,
          user.doctor.email,
          user.token
        );
      }
    });
  }

  async setUserData() {
    return await this.common.getFromLocal('userData').then((val) => {
      if (val && JSON.parse(val)) {
        const user = JSON.parse(val);
        this.userData = new User(
          user.doctor.name,
          user.doctor.phoneNumber,
          user.doctor.profile_image,
          user.doctor.email,
          user.token
        );
      } else {
        this.userData = new User('', '', '', '', '');
      }
    });
  }
}

/**
 * User interface
 */
export class User {
  constructor(
    public name: string,
    public mobile_number: string,
    public profile_image: string,
    public email: string,
    public token: string
  ) {}
}
