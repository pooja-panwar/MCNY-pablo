import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup1',
    loadChildren: () => import('./pages/signup1/signup1.module').then( m => m.Signup1PageModule)
  },
  {
    path: 'signup2',
    loadChildren: () => import('./pages/signup2/signup2.module').then( m => m.Signup2PageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'request-details',
    loadChildren: () => import('./pages/request-details/request-details.module').then( m => m.RequestDetailsPageModule)
  },
  {
    path: 'accepted-requests',
    loadChildren: () => import('./pages/accepted-requests/accepted-requests.module').then( m => m.AcceptedRequestsPageModule)
  },
  {
    path: 'accepted-requests-details',
    loadChildren: () => import('./pages/accepted-requests-details/accepted-requests-details.module').then( m => m.AcceptedRequestsDetailsPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }, 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
