import { Injectable } from '@angular/core';
import { CallHttpService } from './call-http.service';
import { Observable } from 'rxjs';
import { ApiEndPoints } from './constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
    constructor(private http: CallHttpService) {

    } 
    getNotifyData() {
      return this.http.getHttp(ApiEndPoints.NOTIFICATION);
    }
}