import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TasksComponent} from './tasks/tasks.component';
import {TrackerRoutingModule} from "./tracker.routing.module";
import {TasksListComponent} from './tasks/tasks-list/tasks-list.component';
import {TasksEditComponent} from './tasks/task-edit/task-edit.component';
import {FormsModule} from "@angular/forms";
import {TaskService} from "./services/task.service";
import {TaskResource} from "./resources/tasks.resource";
import {TasksBoardComponent} from "./tasks/tasks-board/tasks-board.component";
import {TasksBoardFilter} from "./pipes/tasksBoardFilter";
import {TaskPanelComponent} from "./tasks/task-panel/task-panel.component";
import {ReportsComponent} from "./reports/reports.component";
import { DatepickerModule } from 'ng2-bootstrap/datepicker';
import {TaskStatusService} from "./services/task-status.service";

@NgModule({
  imports: [
    CommonModule,
    TrackerRoutingModule,
    FormsModule,
    DatepickerModule.forRoot()
  ],
  declarations: [
    TasksComponent,
    TasksListComponent,
    TasksEditComponent,
    TasksBoardComponent,
    TasksBoardFilter,
    TaskPanelComponent,
    ReportsComponent
  ],
  providers: [
    TaskResource,
    TaskService,
    TaskStatusService
  ]
})
export class TrackerModule {
}
