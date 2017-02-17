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
import {TaskItemComponent} from "./tasks/task-item/task-item.component";
import {TaskResolver} from "./resolvers/task.resolver";
import {ToastModule} from 'ng2-toastr/ng2-toastr';

@NgModule({
  imports: [
    CommonModule,
    TrackerRoutingModule,
    FormsModule,
    ToastModule.forRoot()
  ],
  declarations: [
    TasksComponent,
    TasksListComponent,
    TasksEditComponent,
    TasksBoardComponent,
    TasksBoardFilter,
    TaskPanelComponent,
    TaskItemComponent
  ],
  providers: [
    TaskResolver,
    TaskResource,
    TaskService
  ]
})
export class TrackerModule {
}
