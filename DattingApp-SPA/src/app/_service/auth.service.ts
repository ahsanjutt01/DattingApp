import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl + 'Auth/';
  private jwtHelpper = new JwtHelperService();
  decodedToken: any;
  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelpper.decodeToken(user.token);
        }
      })
    );
  }
  Register(model: any) {
    return this.http.post(this.baseUrl, model);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelpper.isTokenExpired(token);
  }
}
