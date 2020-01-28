import { Routes } from '@angular/router';

import { UsersComponent } from './users.component';
import { AddComponent } from './components/add.component';
import { EditComponent } from './components/edit.component';
import { StatComponent } from './components/stat.component';

export const UsersRoutes: Routes = [
  {
    path: 'user',
    component: UsersComponent
  },
  {
    path: 'user/add',
    component: AddComponent
  },
  {
    path: 'user/edit/:id',
    component: EditComponent
  },
  {
    path: 'user/stat/:id',
    component: StatComponent
  },
];
