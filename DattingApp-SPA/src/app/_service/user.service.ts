import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.baseUrl + 'users';
  constructor(private http: HttpClient) {}

  getUsers(page? , pageSize?, userPrams? ): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();
    if (page != null && pageSize != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', pageSize.toString());
    }
    if (userPrams != null) {
      params = params.append('maxAge', userPrams.maxAge.toString());
      params = params.append('minAge', userPrams.minAge.toString());
      params = params.append('gender', userPrams.gender.toString());
    }

    return this.http.get<User[]>(this.baseUrl, {observe: 'response', params})
    .pipe(
      map( response => {
        paginatedResult.result = response.body;
        // if ( response.headers.get('pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        // }
        return paginatedResult;
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + '/' + id, user);
  }

  setMainPhoto(id: number, userId: number) {
    return this.http.post(this.baseUrl + '/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + '/' + userId + '/photos/' + id);
  }
}
