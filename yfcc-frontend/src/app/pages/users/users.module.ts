import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { BsDropdownModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { UsersRoutes } from './users.routing';

import { UsersComponent } from './users.component';
import { AddComponent } from './components/add.component';
import { EditComponent } from './components/edit.component';
import { StatComponent } from './components/stat.component';


@NgModule({
  declarations: [
    UsersComponent,
    AddComponent,
    EditComponent,
    StatComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UsersRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    TagInputModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot()
  ]
})
export class UsersModule {}
