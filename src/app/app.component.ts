import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonService } from './providers/global.service';

import { FirebaseX } from '@ionic-native/firebase-x/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public selectedIndex = 0;
  public showMenuBar = false;
  public appPages = [
    {
      title: 'Manage Profile',
      url: '/profile',
      icon: 'assets/img/profile.png',
      class: 'icon1',
    },
    {
      title: 'View Requests',
      url: '/accepted-requests',
      icon: 'assets/img/request.png',
      class: 'icon2',
    },
    {
      title: 'Inquiry List',
      url: '/request-details',
      icon: 'assets/img/call.png',
      class: 'icon3',
    },
    {
      title: 'Notification',
      url: '/notification',
      icon: 'assets/img/bell.png',
      class: 'icon4',
    },
    {
      title: 'Logout',
      url: '',
      icon: 'assets/img/logout.png',
      class: 'Logout',
    },
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menuCtrl: MenuController,
    private router: Router,
    private common: CommonService,
    private navCtrl: NavController,
    private firebaseX: FirebaseX
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkPermission();
    });
  }
  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
    this.handleBackNav();
    this.allowSideMenu();
    
  }
  toggleMenu() {
    this.menuCtrl.toggle();
  }

  /**
   * get firebase device token
   */
  initFirebasePush(){
    this.firebaseX.getToken()
      .then(token => {
        console.log(`The token is ${token}`)
        this.common.saveLocal('device_token', token)
      }) // save the token server-side and use it to push notifications to this device
      .catch(error => console.error('Error getting token'+error));

    this.firebaseX.onMessageReceived()
      .subscribe(data => console.error(`User opened a notification ${data}`));
  }

  checkPermission() {
    console.log('push has permission>>', this.firebaseX.hasPermission())
    this.firebaseX.hasPermission().then((isPerm)=>{
      console.log(isPerm)
      if(isPerm){
        console.log('yes perm')
        this.initFirebasePush();
        
      } else {
        console.log('no perm')
        this.firebaseX.grantPermission().then(()=>{
          this.initFirebasePush();
        }).catch(err => {
          console.error(err)
        }).finally(()=>{
          console.log('done push>>>')
        })
      }
    })
    
  }

  /**
   * call common service fn to check
   * for hardware back button event
   */
  handleBackNav() {
    this.common.handleBackNavigation();
  }

  allowSideMenu() {
    const path = window.location.pathname.split('/')[1];
    if (
      path !== '' &&
      path !== 'login' &&
      path !== 'signup1' &&
      path !== 'signup2' &&
      path !== 'forgot-password' &&
      path !== 'email-verification' &&
      path !== 'registration-success-message'
    ) {
      this.showMenuBar = true;
    } else {
      this.showMenuBar = false;
    }
  }

  /**
   * click on menu items
   * @param menu
   */
  menuClick(menu) {
    console.log(menu);
    switch (menu.title) {
      case 'Logout':
        this.common.removeFromLocal('rememberMe');
        this.common.removeFromLocal('userData');
        this.common.removeFromLocal('loginType');
        this.menuCtrl.toggle();
        this.navCtrl.navigateForward('login');
        break;

      default:
        this.navCtrl.navigateForward(menu.url);
        break;
    }
  }
}
