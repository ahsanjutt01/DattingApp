import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_service/user.service';
import { AlertifyService } from '../_service/alertify.service';
import { Observable, of } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { Message } from '../_models/Message';
import { AuthService } from '../_service/auth.service';

@Injectable()
export class MessageResolver implements Resolve<Message[]> {
    pagenumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';
    constructor(private userService: UserService, private alertify: AlertifyService,
        private router: Router,
        private authService: AuthService
        ) {}
        resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
            return this.userService.getMessages(this.authService.decodedToken.nameid,
              this.pagenumber, this.pageSize, this.messageContainer).pipe(
                catchError(error => {
                    this.alertify.error('problem retriveing Message...!');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );
        }
}
