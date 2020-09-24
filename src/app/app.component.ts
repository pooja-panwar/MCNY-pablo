import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Manage Profile',
      url: '/profile',
      icon: 'assets/img/profile.png',
      class:'icon1'
    },
    {
      title: 'View Requests',
      url: '/accepted-requests',
      icon: 'assets/img/request.png',
      class:'icon2'
    },
    {
      title: 'Inquiry List',
      url: '/request-details',
      icon: 'assets/img/call.png',
      class:'icon3'
    },{
      
    title: 'Notification',
      url: '/notification',
      icon: 'assets/img/bell.png',
      class:'icon4'
    },
    {
      title: 'Logout',
      url: '',
      icon: 'assets/img/logout.png',
      class:'Logout'
    }
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
  toggleMenu() {
    this.menuCtrl.toggle(); 
  }
}

