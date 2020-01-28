import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { ProfileComponent } from "./profile/profile.component";
import { TimelineComponent } from "./timeline/timeline.component";

import { RouterModule } from "@angular/router";
import { ExamplesRoutes } from "./examples.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfileComponent, TimelineComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ExamplesRoutes),
    FormsModule,
    ReactiveFormsModule,
    ProgressbarModule.forRoot(),
    CollapseModule.forRoot()
  ]
})
export class ExamplesModule { }
