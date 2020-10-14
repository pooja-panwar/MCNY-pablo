import { Injectable } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';

//custom service import
import { CommonService } from './global.service';
import { CallHttpService } from './call-http.service';
import { ApiEndPoints } from './constants/api-endpoints';
import { User, UserDataService } from './user-data.service';

/**
 * Upload Photo service
 */
@Injectable({
  providedIn: 'root'
})
export class TakePhotoService {
  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: false,
    allowEdit: true,
    correctOrientation: true
  }

  constructor(
    private camera: Camera,
    private callHttp: CallHttpService,
    private file: File,
    private commonService: CommonService,
    private currUser: UserDataService
  ) { }

  /**
   * Actionsheet with 2 options of upload
   * @param type : library/capture
   */
  takePicture(type) {
    let sourceType: PictureSourceType;
    sourceType = type == 'library' ? this.camera.PictureSourceType.PHOTOLIBRARY : this.camera.PictureSourceType.CAMERA;
    this.options.sourceType = sourceType;
    return this.camera.getPicture(this.options);
  }

  /**
   * Read file from capture/import from gallery
   * @param data : data from getPicture
   */
  startUpload(data) {
    console.log(data)
    if(data.imageData){
      return this.file.resolveLocalFilesystemUrl(data.imageData)
      .then(entry => {
        return (<FileEntry>entry).file((file) => this.readFile(file, data));
      })
      .catch(err => {
        this.commonService.presentToast('Error while reading file.');
      });
    } else {
      const formData = new FormData(); //form object for api request param
      this.uploadImageData(formData); //api call for upload
    }
    
  }

  /**
   * set imagedata in form object
   * @param file 
   * @param data 
   */
  readFile(file: any, data: any){
    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('profileImage', imgBlob, file.name);
      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  /**
   * server call with formdata
   * @param formData 
   * @param data 
   */
  async uploadImageData(formData: FormData) {
    this.callHttp.postHttp(ApiEndPoints.PROFILE_PIC, formData).subscribe(res => {
        //if (res.status) {
          //update user data
          // this.currUser.userData = new User(
          //   res.data.id, 
          //   res.data.address, 
          //   res.data.name, 
          //   res.data.mobile_number, 
          //   res.data.profile_image, 
            
          // );
          //update local db logged in user data
          //this.commonService.saveLocal('userData',JSON.stringify(this.currUser.userData));
          console.log('photo success>>>', res)
          this.commonService.presentToast(res.message);
        //}
      })
  }
}
