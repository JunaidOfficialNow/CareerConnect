import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Education {
  education : string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class EducationsService {

  educations$ = new BehaviorSubject<Education[]>([])
  count$ = new BehaviorSubject(0)

  constructor(private http: HttpClient) { }

  createNewEducation(education: string, page: number, limit: number, query: string) {
    return this.http.post<{skill: string}>(environment.baseUrl + '/educations', {education}).pipe(
      tap(() => this.getPaginatedResults(page, limit, query) )
    )
  }

  getPaginatedResults(page: number, limit: number, query: string) {
    this.http.get<{count: number,educations: {_id: string, education: string}[]}>(environment.baseUrl + '/educations', { params: { page , limit, query}}).subscribe((results)  => {
      this.count$.next(results.count)
      this.educations$.next(results.educations.map(el => ({education: el.education, id: el._id})))
    })
  }

  deleteEducation(id: string, page: number, limit: number, query: string) {
    return this.http.delete(environment.baseUrl + '/educations/' + id).pipe(
      tap(() => this.getPaginatedResults(page, limit, query))
    )
    
  }
}
