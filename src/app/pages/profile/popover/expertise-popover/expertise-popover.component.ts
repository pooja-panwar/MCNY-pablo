import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-expertise-popover',
  templateUrl: './expertise-popover.component.html',
  styleUrls: ['./expertise-popover.component.scss'],
})
export class ExpertisePopoverComponent implements OnInit {
  expertises = [];
  constructor(private navParams: NavParams) {
    this.expertises = this.navParams.get('expertises');
  }

  ngOnInit() {}
}
