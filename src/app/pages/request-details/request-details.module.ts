import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestDetailsPageRoutingModule } from './request-details-routing.module';

import { RequestDetailsPage } from './request-details.page';
//import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SchedulerPopoverComponent } from './scheduler-popover/scheduler-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestDetailsPageRoutingModule,
    NgbModule,
  ],
  //providers: [FileTransfer],
  declarations: [RequestDetailsPage, SchedulerPopoverComponent],
})
export class RequestDetailsPageModule {}
