import {NgModule} from "@angular/core";
import {RouterModule, Routes} from '@angular/router';

import {TaskResolver} from "./resolvers/task.resolver";
import {TasksComponent} from "./tasks/tasks.component";
import {ReportsComponent} from "./reports/reports.component";
import {TaskItemComponent} from "./tasks/task-item/task-item.component";

const routes: Routes = [
  {
    path: '',
    component: TasksComponent
  },
  {
    path: ':taskId',
    component: TaskItemComponent,
    resolve: {
      task: TaskResolver
    },
  },
  {
    path: 'reports',
    component: ReportsComponent
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
