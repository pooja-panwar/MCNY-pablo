import { Injectable } from '@angular/core';
import { CallHttpService } from './call-http.service';
import { ApiEndPoints } from './constants/api-endpoints';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Location } from '@angular/common';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { CommonService } from './global.service';

export class InquiryDetail {
  constructor(
    public active: boolean,
    public address: string,
    public clientName: string,
    public counsellingMethod: string,
    public county: number,
    public dob: string,
    public email: string,
    public id: number,
    public insuranceNumber: string,
    public insuranceProviderId: string,
    public otherExperty: string,
    public phoneNumber: string,
    public preference: string,
    public preferredTiming: Array<string>,
    public providerGenderPreference: string,
    public reasons: Array<string>,
    public serviceStart: string,
    public vcfFileName: string,
    public zip: string,
    public appointment: Date
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class PatientInquiryService {
  path: string = '';
  scheduleStatus = new BehaviorSubject(false);
  schedulePopupClosed = new BehaviorSubject(false);
  downloadPath: string = '';
  showPath;
  downloadEnqSubject = new BehaviorSubject(false);
  private disableDownload: BehaviorSubject<boolean>;

  constructor(
    private http: CallHttpService,
    public alertController: AlertController,
    private fileOpener: FileOpener,
    private commonService: CommonService,
    private location: Location,
    private androidPermissions: AndroidPermissions,
    private file: File,
    private platform: Platform
  ) {
    this.disableDownload = new BehaviorSubject<boolean>(false);
    //this.path = this.file.documentsDirectory;
  }

  //change disable
  changeDisable(): Observable<boolean> {
    return this.disableDownload.asObservable();
  }

  getPatientInquiry(pInquiryId): Observable<InquiryDetail> {
    this.disableDownload.next(false);
    return this.http
      .getHttp(`${ApiEndPoints.PATIENT_INQUIRY}/${pInquiryId}`)
      .pipe(
        map((res) => {
          return new InquiryDetail(
            res.data.active,
            res.data.address,
            res.data.clientName,
            res.data.counsellingMethod,
            res.data.county,
            res.data.dob,
            res.data.email,
            res.data.id,
            res.data.insuranceNumber,
            res.data.insuranceProviderId,
            res.data.otherExperty,
            res.data.phoneNumber,
            res.data.preference,
            res.data.preferredTiming,
            res.data.providerGenderPreference,
            res.data.reasons,
            res.data.serviceStart,
            res.data.vcfFileName,
            res.data.zip,
            res.data.appointment
          );
        })
      );
  }

  async getDownloadPath() {
    if (this.platform.is('ios')) {
      return this.file.documentsDirectory;
    }

    // To be able to save files on Android, we first need to ask the user for permission.
    // We do not let the download proceed until they grant access
    await this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      )
      .then((result) => {
        if (!result.hasPermission) {
          return this.androidPermissions.requestPermission(
            this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
          );
        }
      });

    return this.file.externalRootDirectory + 'Download';
  }

  async downloadInquiry(inquiryFileName = '', inquiryReqId, inquiryStatus) {
    this.path = await this.getDownloadPath();
    console.log('path>>', this.path);
    if (inquiryStatus == 'pending') {
      this.http
        .putHttp(`${ApiEndPoints.REQUESTS}/${inquiryReqId}`, {
          action: 'accept',
        })
        .subscribe((res) => {
          console.log('accept res>>', res);
          this.commonService.presentToast(res.message);
          this.http
            .getHttpVCF(
              `${ApiEndPoints.DOWNLOAD_INQUIRY}/${inquiryFileName}`,
              inquiryFileName,
              this.path
            )
            .subscribe((res) => {
              console.log('res>>>', res);
              this.fileOpener
                .open(res.nativeURL, 'text/x-vcard')
                .then(() => {
                  this.downloadEnqSubject.next(true);
                })
                .catch((e) => console.log('Error opening file', e));
            });
        });
    } else {
      this.http
        .getHttpVCF(
          `${ApiEndPoints.DOWNLOAD_INQUIRY}/${inquiryFileName}`,
          inquiryFileName,
          this.path
        )
        .subscribe((res) => {
          console.log('res>>>', res);
          this.fileOpener
            .open(res.nativeURL, 'text/x-vcard')
            .then(() => {})
            .catch((e) => console.log('Error opening file', e));
        });
    }
  }

  rejectRequest(inquiryReqId, confirmType) {
    this.http
      .putHttp(`${ApiEndPoints.REQUESTS}/${inquiryReqId}`, {
        action: confirmType,
      })
      .subscribe((res) => {
        console.log('accept res>>', res);
        this.disableDownload.next(true);
        this.commonService.presentToast(res.message);
        //this.router.navigate(['notification']);
        this.location.back();
      });
  }

  async presentAlertConfirm(
    inquiryFileName = '',
    inquiryReqId,
    confirmType,
    inquiryStatus
  ) {
    let confirmMesssage = '';

    if (confirmType == 'accept') {
      let msg =
        inquiryStatus === 'active'
          ? 'Do you want to download the request?'
          : 'Do you want to accept the request?';
      confirmMesssage = msg;
    } else {
      confirmMesssage = `Do you want to ${confirmType} the request?`;
    }
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: `<strong>${confirmMesssage}</strong>`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            if (confirmType == 'accept') {
              this.downloadInquiry(
                inquiryFileName,
                inquiryReqId,
                inquiryStatus
              );
            } else {
              this.rejectRequest(inquiryReqId, confirmType);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  getAllInquiries(type) {
    let path = `${ApiEndPoints.REQUESTS}`;
    if (type !== 'all') {
      path += '?status=' + type;
    }
    return this.http.getHttp(path);
  }

  /**
   * doctor set up appointment time for qnquiry
   * @param body data of appointment date and time and patient enquiry Id
   */
  scheduleAppointment(body): Observable<any> {
    return this.http.postHttp(`${ApiEndPoints.scheduleAppointment}`, body);
  }
}
