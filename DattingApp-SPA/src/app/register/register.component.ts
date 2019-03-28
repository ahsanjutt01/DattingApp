import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { AuthService } from '../_service/auth.service';
import { AlertifyService } from '../_service/alertify.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() registermode = new EventEmitter();
  registerForm: FormGroup;
  user: User;
  bsConfig: Partial<BsDatepickerConfig>;
  constructor(
    private _authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    (this.bsConfig = { containerClass: 'theme-red' }), this.createForm();
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4),
    //   Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, this.passwordValidator);
  }
  Register() {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this._authService.Register(this.user).subscribe(
        () => this.alertify.success('Successfuly Signup..1'),
        error => this.alertify.error(error),
        () => {
          this._authService
            .login(this.user)
            .subscribe(() => this.router.navigate(['/member']));
        }
      );
    }
    // this._authService.Register(this.model).subscribe(
    //   next => {
    //     this.Cancel();
    //     this.alertify.success('successfully Signup..!');
    //   },
    //   error => this.alertify.error(error));
    console.log(this.registerForm.value);
  }
  passwordValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  createForm() {
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        knownAs: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        username: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { Validators: this.passwordValidator }
    );
  }

  Cancel() {
    this.registermode.emit(false);
    this.alertify.message('Sign up Cancelled..!');
  }
}
