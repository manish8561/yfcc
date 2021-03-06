import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { BsDropdownModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ProductsRoutes } from './products.routing';

import { ProductsComponent } from './products.component';
import { AddComponent } from './components/add.component';

import { EditComponent } from './components/edit.component';


@NgModule({
  declarations: [
    ProductsComponent,
    AddComponent,
    EditComponent,
    // ElementsComponent,
    // ValidationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ProductsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    TagInputModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot()
  ]
})
export class ProductsModule { }
