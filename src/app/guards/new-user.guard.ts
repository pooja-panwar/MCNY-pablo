import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../providers/global.service';

@Injectable({
  providedIn: 'root',
})
export class NewUserGuard implements CanActivate {
  constructor(private common: CommonService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve) => {
      let val = this.common.getFromLocal('userData');
      const rememberMe = this.common.getFromLocal('rememberMe');
      // check from local db of logged in user data
      if ((val && val.token) === null || rememberMe === 'false') {
        resolve(true);
      } else {
        this.router.navigateByUrl('profile');
        resolve(false);
      }
    });
  }
}
