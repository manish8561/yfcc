import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { BsDropdownModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';


import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { OrdersRoutes } from './orders.routing';

import { OrdersComponent } from './orders.component';
import { AddComponent } from './components/add.component';

import { EditComponent } from './components/edit.component';


@NgModule({
  declarations: [
    OrdersComponent,
    AddComponent,
    EditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(OrdersRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    TagInputModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
  ]
})
export class OrdersModule { }
