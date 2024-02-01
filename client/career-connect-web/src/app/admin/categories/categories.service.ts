import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Category {
  category : string;
  id: string;
}
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {


  categories$ = new BehaviorSubject<Category[]>([])
  count$ = new BehaviorSubject(0)

  constructor(private http: HttpClient) { }

  createNewCategory(category: string, page: number, limit: number, query: string) {
    return this.http.post<{category: string}>(environment.baseUrl + '/categories', {category}).pipe(
      tap(() => this.getPaginatedResults(page, limit, query) )
    )
  }

  getPaginatedResults(page: number, limit: number, query: string) {
    this.http.get<{count: number,categories: {_id: string, category: string}[]}>(environment.baseUrl + '/categories', { params: { page , limit, query}}).subscribe((results)  => {
      this.count$.next(results.count)
      this.categories$.next(results.categories.map(el => ({category: el.category, id: el._id})))
    })
  }

  deleteCategory(id: string, page: number, limit: number, query: string) {
    return this.http.delete(environment.baseUrl + '/categories/' + id).pipe(
      tap(() => this.getPaginatedResults(page, limit, query))
    )
    
  }
}
