import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { JobNotification } from "./JobNotification.interface";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class JobNotificationService {
  http = inject(HttpClient);

  addNewJobNotification(jobNotification: JobNotification) {
    return this.http.post(environment.baseUrl + '/notifications', jobNotification);
  }
}