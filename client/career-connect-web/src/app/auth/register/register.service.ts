import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from 'src/app/shared/UserDto.interface';
import { UpdateJobPreferenceDTO } from 'src/app/shared/updateJobPreference.Dto.interface';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  createNewUser(userRequest: UserDto) {
    return this.http.post<{_id: string}>(environment.baseUrl + '/users', {
      name: userRequest.name,
      email: userRequest.email,
      age: parseInt(userRequest.age),
      phoneNumber: userRequest.phoneNumber,
    })
  }


  updateJobPreferences(userId: string, dto: UpdateJobPreferenceDTO) {
    return this.http.put(environment.baseUrl + '/users/job-preferences/' + userId, dto )
  }
}
