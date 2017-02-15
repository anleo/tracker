import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks/tasks.component';
import {TrackerRoutingModule} from "./tracker.routing.module";
import { TasksListComponent } from './tasks/tasks-list/tasks-list.component';
import { TasksEditComponent } from './tasks/tasks-edit/tasks-edit.component';
import {FormsModule} from "@angular/forms";
import {TaskService} from "./services/task.service";
import {TaskResource} from "./resources/tasks.resource";

@NgModule({
  imports: [
    CommonModule,
    TrackerRoutingModule,
    FormsModule
  ],
  declarations: [
    TasksComponent,
    TasksListComponent,
    TasksEditComponent
  ],
  providers: [
    TaskResource,
    TaskService
  ]
})
export class TrackerModule { }
