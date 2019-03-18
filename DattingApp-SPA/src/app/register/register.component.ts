import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { AuthService } from '../_service/auth.service';
import { AlertifyService } from '../_service/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() registermode = new EventEmitter();
  model: any = {};
  constructor(private _authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }
  Register() {
    this._authService.Register(this.model).subscribe(
      next => {
        this.Cancel();
        this.alertify.success('successfully Signup..!');
      },
      error => this.alertify.error(error));
  }

  Cancel() {
    this.registermode.emit(false);
    this.alertify.message('Sign up Cancelled..!');
  }
}
