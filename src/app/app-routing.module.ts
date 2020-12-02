import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NewUserGuard } from './guards/new-user.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [NewUserGuard],
  },
  {
    path: 'signup1',
    loadChildren: () =>
      import('./pages/signup1/signup1.module').then((m) => m.Signup1PageModule),
    canActivate: [NewUserGuard],
  },
  {
    path: 'signup2',
    loadChildren: () =>
      import('./pages/signup2/signup2.module').then((m) => m.Signup2PageModule),
    canActivate: [NewUserGuard],
  },
  {
    path: 'registration-success-message',
    loadChildren: () =>
      import(
        './pages/registration-success-message/registration-success-message.module'
      ).then((m) => m.RegistrationSuccessMessagePageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'notification',
    loadChildren: () =>
      import('./pages/notification/notification.module').then(
        (m) => m.NotificationPageModule
      ),
  },
  {
    path: 'request-details',
    loadChildren: () =>
      import('./pages/request-details/request-details.module').then(
        (m) => m.RequestDetailsPageModule
      ),
  },
  {
    path: 'accepted-requests',
    loadChildren: () =>
      import('./pages/accepted-requests/accepted-requests.module').then(
        (m) => m.AcceptedRequestsPageModule
      ),
    canActivate: [AuthGuard],
  },
  // {
  //   path: 'accepted-requests-details',
  //   loadChildren: () =>
  //     import(
  //       './pages/accepted-requests-details/accepted-requests-details.module'
  //     ).then((m) => m.AcceptedRequestsDetailsPageModule),
  //   canActivate: [AuthGuard],
  // },
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
    canActivate: [NewUserGuard],
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: 'inquiry-list',
    loadChildren: () =>
      import('./pages/inquiry-list/inquiry-list.module').then(
        (m) => m.InquiryListPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
