import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
//import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Crop } from '@ionic-native/crop/ngx';
// import { ImageCropperModule } from 'ngx-image-cropper';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpErrorInterceptor } from './interceptors/http-error-interceptor';
import { IonicStorageModule } from '@ionic/storage';
import { UserDataService } from './providers/user-data.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserDataService,
    FirebaseX,
    File,
    Camera,
    WebView,
    FileOpener,
    Crop,
    // ImageCropperModule,
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }, // httpClient interceptors for common header and error handling
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
