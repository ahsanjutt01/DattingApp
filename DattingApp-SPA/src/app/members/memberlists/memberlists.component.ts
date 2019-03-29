import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_service/user.service';
import { AlertifyService } from '../../_service/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';

@Component({
  selector: 'app-memberlists',
  templateUrl: './memberlists.component.html',
  styleUrls: ['./memberlists.component.css']
})
export class MemberlistsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  genderList = [ {value: 'male', display: 'Males'}, {value: 'female', display: 'Females'} ];
  userPrams: any = {};
  user = JSON.parse(localStorage.getItem('user'));
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination ;
      this.userPrams.gender = this.user.gender === 'female' ? 'male' : 'female';
      this.userPrams.minAge = 18;
      this.userPrams.maxAge = 99;
      this.userPrams.orderBy = 'lastActive';
    });
  }
  resetFilters() {
    this.userPrams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userPrams.minAge = 18;
    this.userPrams.maxAge = 99;
    this.loadUsers();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage,
      this.userPrams).subscribe((res: PaginatedResult<User[]>) => {
      this.users = null;
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
}
