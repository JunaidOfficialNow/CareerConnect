import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "src/environments/environment";
import { BehaviorSubject, tap } from "rxjs";
import { JobNotificationDoc } from "src/app/shared/jobNotification.interface";
import { JobNotificationDto } from "./JobNotification.interface";


@Injectable({providedIn: 'root'})
export class JobNotificationService {
  http = inject(HttpClient);

  jobNotifications$ = new BehaviorSubject<JobNotificationDoc[]>([])
  count$ = new BehaviorSubject(0);


  addNewJobNotification(jobNotification: JobNotificationDto, page: number, limit: number, query: string, order: string) {
    return this.http.post<JobNotificationDoc>(environment.baseUrl + '/notifications', jobNotification)
    .pipe(tap(() => this.getPaginatedResults(page,limit, query , order)) );
  }

   getPaginatedResults(page: number, limit: number, query: string, order: string) {
    this.http.get<{count: number, jobNotifications: JobNotificationDoc[]}>(environment.baseUrl + '/notifications', { params: { page, limit, query, order}})
    .subscribe((results) => (this.count$.next(results.count), this.jobNotifications$.next(results.jobNotifications)))
   }

   deleteJobNotification(id: string, page: number, limit: number, query: string, order: string) {
    return this.http.delete(environment.baseUrl + '/notifications/' + id).pipe(
      tap(() => this.getPaginatedResults(page, limit, query, order))
    )
   }
}