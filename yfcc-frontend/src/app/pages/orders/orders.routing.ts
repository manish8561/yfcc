import { Routes } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { AddComponent } from './components/add.component';
import { EditComponent } from './components/edit.component';

export const OrdersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: OrdersComponent
      }
    ]
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'edit/:id',
    component: EditComponent
  },
];
