import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "src/environments/environment";

export interface JobNotificationDoc {
  _id: string;
  jobTitle: string;
  CompanyOrDept: string;
  description: string;
  location: string;
  category: string;
  educations: string[];
  skills: string[];
  deadline: Date,
  jobType: string;
  govtOrNot: string;
  applicationLink: string;
  officialLink: string;
  websiteLink: string;
  minQualification: string;
}

@Injectable({providedIn: 'root'})
export class HomeService {
  http = inject(HttpClient)

  getJobNotifications() {
    return this.http.get<JobNotificationDoc[]>(environment.baseUrl + '/notifications');
  }
}