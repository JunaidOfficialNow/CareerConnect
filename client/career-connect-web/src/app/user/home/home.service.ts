import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { JobNotificationDoc } from "src/app/shared/jobNotification.interface";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})
export class HomeService {
  http = inject(HttpClient)

  getJobNotifications() {
    return this.http.get<JobNotificationDoc[]>(environment.baseUrl + '/notifications');
  }
}