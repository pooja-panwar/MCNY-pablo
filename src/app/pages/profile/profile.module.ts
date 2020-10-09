import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { EditProfileComponent } from './children/edit-profile/edit-profile.component';
import { ViewProfileComponent } from './children/view-profile/view-profile.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ProfilePageRoutingModule],
  declarations: [ProfilePage, EditProfileComponent, ViewProfileComponent],
})
export class ProfilePageModule {}
