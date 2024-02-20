import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { tap } from 'rxjs';
import { JobNotificationDoc } from 'src/app/shared/jobNotification.interface';
import { UserDoc } from 'src/app/shared/userDoc.interface';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class HomeService {
  http = inject(HttpClient);
  auth = inject(Auth);

  getJobNotifications(query: string = '') {
    return this.http.get<JobNotificationDoc[]>(
      environment.baseUrl + '/notifications/for-you',
      { params: { query } }
    );
  }

  getCurrentUserData() {
    return this.http.get<UserDoc>(
      environment.baseUrl + '/users/' + this.auth.currentUser?.email
    );
  }

  getSearchSuggestions(query: string = '') {
    return this.http.get<string[]>(
      environment.baseUrl + '/filters/search-suggetions',
      { params: { query } }
    );
  }
}
