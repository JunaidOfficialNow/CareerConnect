import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISampleLists } from 'src/app/shared/SampleLists.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  constructor(private http: HttpClient) {}
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
