import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { EditProfileComponent } from './children/edit-profile/edit-profile.component';
import { ViewProfileComponent } from './children/view-profile/view-profile.component';
import { ExpertisePopoverComponent } from './popover/expertise-popover/expertise-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,
  ],
  declarations: [
    ProfilePage,
    EditProfileComponent,
    ViewProfileComponent,
    ExpertisePopoverComponent,
  ],
})
export class ProfilePageModule {}
