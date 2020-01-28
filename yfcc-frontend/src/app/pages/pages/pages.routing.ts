import { Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { AddComponent } from './components/add.component';
import { EditComponent } from './components/edit.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PagesComponent
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
