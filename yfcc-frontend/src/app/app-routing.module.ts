import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { PresentationComponent } from './pages/presentation/presentation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'presentation',
    component: PresentationComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboards',
        loadChildren: './pages/dashboards/dashboards.module#DashboardsModule'
      },
      {
        path: 'order',
        loadChildren: './pages/orders/orders.module#OrdersModule'
      },
      {
        path: 'post',
        loadChildren: './pages/posts/posts.module#PostsModule'
      },
      {
        path: 'page',
        loadChildren: './pages/pages/pages.module#PagesModule'
      },
      {
        path: 'product',
        loadChildren: './pages/products/products.module#ProductsModule'
      },
      {
        path: 'user',
        loadChildren: './pages/users/users.module#UsersModule'
      },
      {
        path: 'category',
        loadChildren: './pages/categories/categories.module#CategoriesModule'
      },
      {
        path: 'team',
        loadChildren: './pages/teams/teams.module#TeamsModule'
      },
      {
        path: 'match',
        loadChildren: './pages/matches/matches.module#MatchesModule'
      },
      {
        path: 'schedule',
        loadChildren: './pages/schedules/schedules.module#SchedulesModule'
      },
      {
        path: 'components',
        loadChildren: './pages/components/components.module#ComponentsModule'
      },
      {
        path: 'forms',
        loadChildren: './pages/forms/forms.module#FormsModules'
      },
      {
        path: 'tables',
        loadChildren: './pages/tables/tables.module#TablesModule'
      },
      {
        path: 'maps',
        loadChildren: './pages/maps/maps.module#MapsModule'
      },
      {
        path: 'widgets',
        loadChildren: './pages/widgets/widgets.module#WidgetsModule'
      },
      {
        path: 'charts',
        loadChildren: './pages/charts/charts.module#ChartsModule'
      },
      {
        path: 'calendar',
        loadChildren: './pages/calendar/calendar.module#CalendarModule'
      },
      {
        path: '',
        loadChildren: './pages/examples/examples.module#ExamplesModule'
      }

    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren:
          './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
