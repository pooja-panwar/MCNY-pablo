import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcceptedRequestsPageRoutingModule } from './accepted-requests-routing.module';

import { AcceptedRequestsPage } from './accepted-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcceptedRequestsPageRoutingModule
  ],
  declarations: [AcceptedRequestsPage]
})
export class AcceptedRequestsPageModule {}
