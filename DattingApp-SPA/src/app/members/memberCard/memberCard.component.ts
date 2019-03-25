import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-card',
  templateUrl: './memberCard.component.html',
  styleUrls: ['./memberCard.component.css']
})
export class MemberCardComponent implements OnInit {

@Input()  user: User;
  constructor() { }

  ngOnInit() {
  }

}
