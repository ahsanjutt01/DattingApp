import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { AuthService } from '../_service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() registermode = new EventEmitter();
  model: any = {};
  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }
  Register() {
    this._authService.Register(this.model).subscribe(
      next => {
        this.Cancel();
        console.log('successfully Signup..!')
      },
      error => console.log(error));
    console.log(this.model);
  }

  Cancel() {
    this.registermode.emit(false);
  }
}
