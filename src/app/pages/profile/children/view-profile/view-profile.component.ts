import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { CommonService } from 'src/app/providers/global.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit {
  user;
  constructor(
    private userService: UserService,
    private common: CommonService
  ) {}

  ngOnInit() {
    this.getUserPofile();
  }

  //get user profile details
  getUserPofile() {
    this.userService.getUserProfile().subscribe((data) => {
      console.log(data);
      this.user = data.data.doctor;
      this.common.emitUserSubject(this.user);
    });
  }
}
