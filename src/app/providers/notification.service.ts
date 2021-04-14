import { Injectable } from '@angular/core';
import { CallHttpService } from './call-http.service';
import { ApiEndPoints } from './constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
    constructor(private http: CallHttpService) {

    } 
    getNotifyData(limit) {
      console.log(limit)
      let apiURL = limit==0? ApiEndPoints.NOTIFICATION : `${ApiEndPoints.NOTIFICATION}?limit=${limit}`;
      return this.http.getHttp(apiURL);
    }

    readNotification(notifyId) {
      return this.http.putHttp(`${ApiEndPoints.NOTIFICATION}/${notifyId}`)
    }
}