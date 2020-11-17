import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InquiryListPageRoutingModule } from './inquiry-list-routing.module';

import { InquiryListPage } from './inquiry-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InquiryListPageRoutingModule
  ],
  declarations: [InquiryListPage]
})
export class InquiryListPageModule {}
