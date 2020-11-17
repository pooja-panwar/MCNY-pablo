import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InquiryListPage } from './inquiry-list.page';

const routes: Routes = [
  {
    path: '',
    component: InquiryListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InquiryListPageRoutingModule {}
