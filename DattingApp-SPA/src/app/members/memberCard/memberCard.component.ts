import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_service/auth.service';
import { UserService } from 'src/app/_service/user.service';
import { AlertifyService } from 'src/app/_service/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './memberCard.component.html',
  styleUrls: ['./memberCard.component.css']
})
export class MemberCardComponent implements OnInit {

@Input()  user: User;
  constructor(private authService: AuthService,
    private userSerivce: UserService,
    private aletify: AlertifyService
    ) { }

  ngOnInit() {
  }
sendLike(id: number) {
      this.userSerivce.sendLike(this.authService.decodedToken.nameid, id)
        .subscribe(() => this.aletify.success('You have liked: ' + this.user.knownAs),
        error => this.aletify.error(error));
  }
}
