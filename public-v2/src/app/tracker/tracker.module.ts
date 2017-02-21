import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {ToastModule} from 'ng2-toastr/ng2-toastr';

import {TaskResolver} from "./resolvers/task.resolver";
import {TaskService} from "./services/task.service";
import {TaskResource} from "./resources/tasks.resource";
import {TrackerRoutingModule} from "./tracker.routing.module";

import {TasksBoardFilter} from "./pipes/tasks-board.pipe";

import {TasksComponent} from './tasks/tasks.component';
import {TaskItemComponent} from "./tasks/task-item/task-item.component";
import {TasksListComponent} from './tasks/tasks-list/tasks-list.component';
import {TasksEditComponent} from './tasks/task-edit/task-edit.component';
import {TaskPanelComponent} from "./tasks/task-panel/task-panel.component";
import {TasksBoardComponent} from "./tasks/tasks-board/tasks-board.component";
import {ReportsComponent} from "./reports/reports.component";
import { DatepickerModule } from 'ng2-bootstrap/datepicker';
import {TaskStatusService} from "./services/task-status.service";
import {TaskMetricsComponent } from './tasks/task-metrics/task-metrics.component';
import {TooltipModule} from "ng2-bootstrap";
import { MetricsWidgetComponent } from './tasks/metrics-widget/metrics-widget.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TrackerRoutingModule,
    ToastModule.forRoot(),
    FormsModule,
    DatepickerModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    TasksBoardFilter,
    TasksComponent,
    TasksListComponent,
    TasksEditComponent,
    TasksBoardComponent,
    TaskPanelComponent,
    TaskItemComponent,
    ReportsComponent,
    TaskMetricsComponent,
    MetricsWidgetComponent
  ],
  providers: [
    TaskResolver,
    TaskResource,
    TaskService,
    TaskStatusService
  ]
})
export class TrackerModule {
}
