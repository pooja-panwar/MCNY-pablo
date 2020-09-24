import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcceptedRequestsDetailsPageRoutingModule } from './accepted-requests-details-routing.module';

import { AcceptedRequestsDetailsPage } from './accepted-requests-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcceptedRequestsDetailsPageRoutingModule
  ],
  declarations: [AcceptedRequestsDetailsPage]
})
export class AcceptedRequestsDetailsPageModule {}
