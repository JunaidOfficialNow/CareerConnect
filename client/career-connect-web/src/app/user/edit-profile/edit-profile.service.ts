import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { UserDto } from "src/app/shared/UserDto.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class EditProfileService {
  http = inject(HttpClient);


  updateUserProfile(id: string, userDto: UserDto) {
    return this.http.put(environment.baseUrl+'/users/' + id, {userDto})
  }
}