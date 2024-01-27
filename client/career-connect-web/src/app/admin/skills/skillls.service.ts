import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkilllsService {

  constructor(private http: HttpClient) { }

  createNewSkill(skill: string) {
    return this.http.post<{skill: string}>(environment.baseUrl + '/skills', {skill})
  }
}
