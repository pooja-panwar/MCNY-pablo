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
export class AuthGuard implements CanActivate {
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
      this.common.getFromLocal('userData').then((val) => {
        // check from local db of logged in user data
        if (val && JSON.parse(val).token) {
          console.log('yooooo' + val && JSON.parse(val).token);
          resolve(true);
        } else {
          //navigate to login if not authenticated
          this.router.navigateByUrl('login');
          resolve(false);
        }
      });
    });
  }
}
