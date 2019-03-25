import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import {User} from '../_models/user';
import { UserService } from '../_service/user.service';
import { AlertifyService } from '../_service/alertify.service';
import { Observable, of } from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
    constructor(private userService: UserService, private alertify: AlertifyService,
        private router: Router) {}
        resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
            return this.userService.getUsers().pipe(
                catchError(error => {
                    this.alertify.error('problem retriveing data...!');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );
        }
}