import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TagInputModule } from 'ngx-chips';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { PresentationModule } from './pages/presentation/presentation.module';

import { AppRoutingModule } from './app-routing.module';

import { ComponentsModule } from './components/components.module';
import { CommonService } from './shared/common.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    AppRoutingModule,
    ToastrModule.forRoot(),
    CollapseModule.forRoot(),
    TagInputModule,
    PresentationModule
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent],
  providers: [CommonService, { provide: HTTP_INTERCEPTORS, useClass: CommonService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
