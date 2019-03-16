import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  IsLoggedIn: boolean = !!localStorage.getItem('token');
  registerMode = false;
  constructor() { }

  ngOnInit() {
  }
  Register() {
    this.registerMode = true;
  }
  CancelRegisterOutput(cencelRegister: boolean) {
    this.registerMode = false;
  }
}
