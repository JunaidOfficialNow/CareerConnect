import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Skill {
  skill : string;
}

@Injectable({
  providedIn: 'root'
})
export class SkilllsService {


  skills = new BehaviorSubject<Skill[]>([])

  constructor(private http: HttpClient) { }

  createNewSkill(skill: string, page: number, limit: number) {
    return this.http.post<{skill: string}>(environment.baseUrl + '/skills', {skill}).pipe(
      tap(() => this.getPaginatedResults(page, limit) )
    )
  }

  getPaginatedResults(page: number, limit: number) {
    this.http.get<{skills: {_id: string}[]}>(environment.baseUrl + '/skills', { params: { page , limit}}).subscribe((results)  => {
      this.skills.next(results.skills.map(el => ({skill: el._id})))
    })
  }

  getSkillsCount() {
    return this.http.get<{count: number}>(environment.baseUrl + '/skills/count');
  }

  deleteSkill(id: string, page: number, limit: number) {
    return this.http.delete(environment.baseUrl + '/skills/' + id).pipe(
      tap(() => this.getPaginatedResults(page, limit))
    )
    
  }
}

