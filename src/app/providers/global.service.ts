import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

/**
 * Common service used throughout app
 */
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  loading: any;
  isLoading: boolean = false;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage
  ) {}
  /**
   * save to local db
   * @param key : name of the key that should be unique
   * @param value : value can be anything but will be saved in string
   */
  async saveLocal(key, value) {
    await this.storage.set(key, value);
  }

  /**
   * get call from local db
   * @param key : unique key to get the local data
   */
  async getFromLocal(key) {
    let val = await this.storage.get(key);
    return val;
  }

  /**
   * remove data from local db
   * @param key : unique key to remove the local data
   */
  async removeFromLocal(key) {
    await this.storage.remove(key);
  }

  /**
   * Show toast with message
   * @param text : message to display on toast
   */
  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  /**
   * hide loading bar
   * for android
   */
  async hideLoader() {
    this.isLoading = false;
    return await this.loadingCtrl
      .dismiss()
      .then(() => console.log('dismissed'));
  }

  /**
   * display loader
   */
  async displayLoader() {
    this.isLoading = true;
    return await this.loadingCtrl
      .create({
        spinner: 'dots',
        message: 'Loading Please Wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading',
        backdropDismiss: true,
      })
      .then((a) => {
        a.present().then(() => {
          console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }
}
