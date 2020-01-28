import { Routes } from '@angular/router';

import { SchedulesComponent } from './schedules.component';
import { AddComponent } from './components/add.component';
import { EditComponent } from './components/edit.component';

export const SchedulesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SchedulesComponent
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
