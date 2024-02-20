import { HttpClient  } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { UpdateJobPreferenceDTO } from "src/app/shared/updateJobPreference.Dto.interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class EditJObPreferenceService {

  private http = inject(HttpClient);

  updateJobPreferences(userId: string, dto: UpdateJobPreferenceDTO) {
    return this.http.put(environment.baseUrl + '/users/job-preferences/' + userId, dto )
  }
}