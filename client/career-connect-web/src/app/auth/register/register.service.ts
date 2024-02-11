import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ISampleLists } from 'src/app/shared/SampleLists.interface';
import { environment } from 'src/environments/environment';

export interface ICreateUserRequest {
  name: string;
  age: string;
  phoneNumber: string;
  email: string;
}

export interface UpdateJobPreferenceDTO {
   highestEducation: string;
   course: string | null | undefined;
   remoteJob: boolean,
   OnSiteJob: boolean;
   HybridJob: boolean;
   govtJob: boolean;
   nonGovtJob: boolean;
   skills: string[];
   categoriesInterested: string[];
}


@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  createNewUser(userRequest: ICreateUserRequest) {
    return this.http.post<{_id: string}>(environment.baseUrl + '/users', {
      name: userRequest.name,
      email: userRequest.email,
      age: parseInt(userRequest.age),
      phoneNumber: userRequest.phoneNumber,
    })
    // .pipe(catchError((err, caugth) => {
    //   console.log(err, caugth)

    //   return of(null);
    // }));
  }


  updateJobPreferences(userId: string, dto: UpdateJobPreferenceDTO) {
    return this.http.post(environment.baseUrl + '/users/job-preferences/' + userId, dto )
  }
}
