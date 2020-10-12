import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/providers/user.service';
import { CommonService } from 'src/app/providers/global.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit {
  @Input() user;
  constructor(
    private userService: UserService,
    private common: CommonService
  ) {}

  ngOnInit() {}
}
