import {NgModule} from "@angular/core";
import {RouterModule, Routes} from '@angular/router';

import {TaskResolver} from "./resolvers/task.resolver";
import {TasksComponent} from "./tasks/tasks.component";
import {ReportsComponent} from "./reports/reports.component";
import {TaskItemComponent} from "./tasks/task-item/task-item.component";
import {MyTasksComponent} from "./tasks/my-tasks/my-tasks.component";
import {TaskSearchComponent} from "./tasks/task-search/task-search.component";

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
    path: ':taskId',
    component: TaskItemComponent,
    resolve: {
      task: TaskResolver
    },
  },
  {
    path: ':taskId/search/:query',
    component: TaskSearchComponent
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
