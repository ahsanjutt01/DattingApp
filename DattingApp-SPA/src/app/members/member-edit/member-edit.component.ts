import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_service/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_service/user.service';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  user: User;
  photoUrl: string;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotificaiton($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => (this.user = data['user']));
    this.auth.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
  updateUser() {
    console.log(this.auth.decodedToken.nameid);
    this.userService.updateUser(this.auth.decodedToken.nameid, this.user)
    .subscribe(next => {
      this.alertify.success('Profile updated successfully!');
      // console.log(this.user.intrest);
      this.editForm.reset(this.user);
      // console.log(this.user.intrest);
    }, error => {
      console.log(error);
      this.alertify.error(error);
    });
  }
  updatedMainPhoto(mainPhotoUrl: string) {
    this.user.photoUrl = mainPhotoUrl;
  }
}
