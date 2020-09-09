import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { FormsModule as ngFormsModule } from '@angular/forms';
import {ManageUsersComponent} from './manage-users/manage-users.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    UsersRoutingModule,
    NbSelectModule,
    NbIconModule,
    ngFormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    UsersComponent,
    ManageUsersComponent,
  ],
})
export class UsersModule { }
