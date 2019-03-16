import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
  import { map } from 'rxjs/operators';

  @Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:5000/api/Auth/';
constructor(private http: HttpClient) { }

login(model: any) {
  return this.http.post(this.baseUrl + 'login', model)
  .pipe( map((response: any) => {
      const user = response;
      if (user) {
        localStorage.setItem('token', user.token);
      }
    })
  );
}
Register(model: any) {
  return this.http.post(this.baseUrl, model);
}

}
