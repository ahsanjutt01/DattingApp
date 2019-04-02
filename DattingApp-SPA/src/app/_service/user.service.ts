import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/Message';

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

  getUsers(page? , pageSize?, userPrams?, likePrams? ): Observable<PaginatedResult<User[]>> {
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
    if (likePrams === 'likers') {
      params = params.append('likers', 'true');
    }
    if (likePrams === 'likees') {
      params = params.append('likees', 'true');
    }

    return this.http.get<User[]>(this.baseUrl, {observe: 'response', params})
    .pipe(
      map( response => {
        paginatedResult.result = response.body;
        if ( response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
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
  sendLike(userId: number, recipientId: number) {
    return this.http.post(this.baseUrl + '/' + userId + '/like/' + recipientId, {});
  }

  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
      params = params.append('messageContainer', messageContainer.toString());

    }

    return this.http.get<Message[]>(this.baseUrl + '/' + id + '/messages', {observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if ( response.headers.get('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }
  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + '/' + id + '/messages/thread/' + recipientId);
  }
  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + '/' + id + '/messages', message);
  }
  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + '/' + userId + '/messages/' + id, {});
  }

  markAsRead(userId: number, messageId: number) {
    this.http.post(this.baseUrl + '/' + userId + '/messages/' + messageId + '/read', {}).subscribe();
  }
}
