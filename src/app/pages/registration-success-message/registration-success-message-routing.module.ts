import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationSuccessMessagePage } from './registration-success-message.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationSuccessMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationSuccessMessagePageRoutingModule {}
