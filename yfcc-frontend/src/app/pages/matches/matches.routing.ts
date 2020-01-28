import { Routes } from '@angular/router';

import { MatchesComponent } from './matches.component';
// import { ElementsComponent } from './elements/elements.component';
// import { ValidationComponent } from './validation/validation.component';
import { AddComponent } from './components/add.component';
import { EditComponent } from './components/edit.component';

export const MatchesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MatchesComponent
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
