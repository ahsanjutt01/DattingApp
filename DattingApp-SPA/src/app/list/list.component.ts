import { Component, OnInit } from '@angular/core';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { AuthService } from '../_service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../_service/user.service';
import { AlertifyService } from '../_service/alertify.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  users: User[];
  pagination: Pagination;
  likePrams = 'likers';
  constructor(private auth: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertify: AlertifyService) { }

  ngOnInit() {
      this.route.data.subscribe((data) => {
        this.users = data['users'].result;
        this.pagination = data['users'].pagination;
      });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage,
      this.pagination.itemsPerPage, null, this.likePrams)
      .subscribe((res: PaginatedResult<User[]>) => {
      this.users = null;
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
}
