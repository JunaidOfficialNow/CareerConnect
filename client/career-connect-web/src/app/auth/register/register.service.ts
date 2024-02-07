import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ICreateUserRequest {
  name: string;
  age: string;
  phoneNumber: string;
  email: string;
}

export interface ISampleLists {
  skills: { skill: string }[];
  educations: { education: string }[];
  categories: { category: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  createNewUser(userRequest: ICreateUserRequest) {
    return this.http.post(environment.baseUrl + '/users', {
      name: userRequest.name,
      email: userRequest.email,
      age: parseInt(userRequest.age),
      phoneNumber: userRequest.phoneNumber,
    });
  }

  getSampleLists() {
    return this.http.get<ISampleLists>(environment.baseUrl + '/filters');
  }

  getCategoryFilters(query: string) {
    return this.http.get<{_id: string, category: string}[]>(environment.baseUrl + '/filters/category/' + query);
  }

  getSkillsFilters(query: string) {
    return this.http.get<{_id: string, skill: string}[]>(environment.baseUrl + '/filters/skills/' + query);
  }

  getEducationFilters(query: string) {
    return this.http.get<{_id: string, education: string}[]>(environment.baseUrl + '/filters/educations/' + query);
  }
}
