import { Routes } from '@angular/router';

import { TeamsComponent } from './teams.component';
// import { ElementsComponent } from './elements/elements.component';
// import { ValidationComponent } from './validation/validation.component';
import { AddComponent } from './components/add.component';
import { EditComponent } from './components/edit.component';

export const TeamsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: TeamsComponent
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
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: 'validation',
  //       component: ValidationComponent
  //     }
  //   ]
  // }
];
