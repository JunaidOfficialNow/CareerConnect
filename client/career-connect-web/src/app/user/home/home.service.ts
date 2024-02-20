import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { tap } from "rxjs";
import { JobNotificationDoc } from "src/app/shared/jobNotification.interface";
import { UserDoc } from "src/app/shared/userDoc.interface";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})
export class HomeService {
  http = inject(HttpClient)
  auth = inject(Auth);

  getJobNotifications() {
    return this.http.get<JobNotificationDoc[]>(environment.baseUrl + '/notifications/for-you');
  }

  getCurrentUserData() {
    return this.http.get<UserDoc>(environment.baseUrl + '/users/' +this.auth.currentUser?.email );
  }
}