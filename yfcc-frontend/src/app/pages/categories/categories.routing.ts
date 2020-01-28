import { Routes } from '@angular/router';

import { CategoriesComponent } from './categories.component';
import { AddComponent } from './components/add.component';
import { EditComponent } from './components/edit.component';

export const CategoriesRoutes: Routes = [
  {
    path: '',
    component: CategoriesComponent
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
