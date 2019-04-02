import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { UserService } from 'src/app/_service/user.service';
import { AuthService } from 'src/app/_service/auth.service';
import { AlertifyService } from 'src/app/_service/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  constructor(private userService: UserService,
    private authService: AuthService,
    private alertify: AlertifyService
    ) { }

  ngOnInit() {
    this.loadMessages();
  }
  loadMessages() {
    const userId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
    .pipe(
      tap(messages => {
        for (let i = 0; i < messages.length; i++) {
          if(messages[i].isRead === false && messages[i].recipientId === userId) {
            this.userService.markAsRead(userId, messages[i].id);
          }
        }
      })
    )
    .subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }
  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe((message: Message) => {
      this.messages.unshift(message);
      this.newMessage.content = '';
    }, error => this.alertify.error(error));
  }
}
