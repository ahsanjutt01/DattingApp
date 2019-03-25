import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberlistsComponent } from './members/memberlists/memberlists.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guard/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PreventUnsavedChanges } from './_guard/prevent-unsaved-changes.guard';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'member', component: MemberlistsComponent,
    resolve: {users: MemberListResolver} },
      { path: 'member/edit', component: MemberEditComponent,
      resolve: {user:  MemberEditResolver}, canDeactivate: [PreventUnsavedChanges] },
      { path: 'member/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver} },
      { path: 'lists', component: ListComponent },
      { path: 'messages', component: MessagesComponent }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
