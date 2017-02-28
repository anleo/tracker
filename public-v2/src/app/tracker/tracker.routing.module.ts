import {NgModule} from "@angular/core";
import {RouterModule, Routes} from '@angular/router';

import {TaskResolver} from "./resolvers/task.resolver";
import {TasksComponent} from "./tasks/tasks.component";
import {ReportsComponent} from "./reports/reports.component";
import {TaskItemComponent} from "./tasks/task-item/task-item.component";
import {MyTasksComponent} from "./tasks/my-tasks/my-tasks.component";
import {TaskArchiveComponent} from "./tasks/components/task-archive/task-archive.component";

const routes: Routes = [
  {
    path: '',
    component: TasksComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'my',
    component: MyTasksComponent
  },
  {
    path: 'archived',
    component: TaskArchiveComponent
  },
  {
    path: ':taskId',
    component: TaskItemComponent,
    resolve: {
      task: TaskResolver
    }
  },
  {
    path: ':taskId/archive',
    component: TaskArchiveComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackerRoutingModule {
}
