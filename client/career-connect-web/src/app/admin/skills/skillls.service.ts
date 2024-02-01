import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Skill {
  skill : string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class SkilllsService {


  skills$ = new BehaviorSubject<Skill[]>([])
  count$ = new BehaviorSubject(0)

  constructor(private http: HttpClient) { }

  createNewSkill(skill: string, page: number, limit: number, query: string) {
    return this.http.post<{skill: string}>(environment.baseUrl + '/skills', {skill}).pipe(
      tap(() => this.getPaginatedResults(page, limit, query) )
    )
  }

  getPaginatedResults(page: number, limit: number, query: string) {
    this.http.get<{count: number,skills: {_id: string, skill: string}[]}>(environment.baseUrl + '/skills', { params: { page , limit, query}}).subscribe((results)  => {
      this.count$.next(results.count)
      this.skills$.next(results.skills.map(el => ({skill: el.skill, id: el._id})))
    })
  }

  deleteSkill(id: string, page: number, limit: number, query: string) {
    return this.http.delete(environment.baseUrl + '/skills/' + id).pipe(
      tap(() => this.getPaginatedResults(page, limit, query))
    )
    
  }
}

