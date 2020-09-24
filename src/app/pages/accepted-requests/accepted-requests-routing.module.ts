import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcceptedRequestsPage } from './accepted-requests.page';

const routes: Routes = [
  {
    path: '',
    component: AcceptedRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcceptedRequestsPageRoutingModule {}
