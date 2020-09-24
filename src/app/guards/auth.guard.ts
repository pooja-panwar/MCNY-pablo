import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from '../providers/global.service';
import { NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private navCtrl: NavController,
    private common : CommonService
  ) { }

  /**
   * @param next 
   * @param state
   * guard applied on routes to check whether route is authenticated or not
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve) => {
      this.common.getFromLocal('userData').then((val) => { // check from local db of logged in user data
        if( val && JSON.parse(val).id) {
          resolve(true);
        } else {
          if(state.url == '/home/guest') {
            resolve(true);
          } else {
            //navigate to login if not authenticated
            this.navCtrl.navigateBack('login')
            resolve(false);
          }
        }
      });
    })
  }
  
}
