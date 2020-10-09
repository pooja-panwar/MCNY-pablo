import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-registration-success-message',
  templateUrl: './registration-success-message.page.html',
  styleUrls: ['./registration-success-message.page.scss'],
})
export class RegistrationSuccessMessagePage implements OnInit {
  constructor(private router: Router, private platform: Platform) {}
  subscription;
  ngOnInit() {
    this.routeToLogin();
    this.disableBackNav();
  }

  routeToLogin() {
    setTimeout(() => {
      this.router.navigate(['login']);
    }, 10000);
  }
  /**
   * disable user to navigate back to signup page 1
   */
  disableBackNav() {
    this.subscription = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {}
    );
  }
}
