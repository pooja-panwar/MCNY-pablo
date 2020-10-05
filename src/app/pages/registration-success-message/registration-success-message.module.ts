import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationSuccessMessagePageRoutingModule } from './registration-success-message-routing.module';

import { RegistrationSuccessMessagePage } from './registration-success-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationSuccessMessagePageRoutingModule
  ],
  declarations: [RegistrationSuccessMessagePage]
})
export class RegistrationSuccessMessagePageModule {}
