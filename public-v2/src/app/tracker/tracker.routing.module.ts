import {NgModule} from "@angular/core";
import {RouterModule, Routes} from '@angular/router';

import {TaskResolver} from "./resolvers/task.resolver";
import {TasksComponent} from "./tasks/tasks.component";
import {CommonReportComponent} from "./reports/common-report/common-report.component";
import {TaskItemComponent} from "./tasks/task-item/task-item.component";
import {MyTasksComponent} from "./tasks/my-tasks/my-tasks.component";
import {TaskReportComponent} from "./reports/task-report/task-report.component";
import {TaskArchiveComponent} from "./tasks/components/task-archive/task-archive.component";
import {TaskSearchComponent} from "./tasks/task-search/task-search.component";
import {BlankComponent} from "../blank/blank.component";
import {TaskTagsSearchComponent} from "./tasks/task-tags-search/task-tags-search.component";

const routes: Routes = [
  {
    path: '',
    component: TasksComponent
  },
  {
    path: 'reports',
    component: CommonReportComponent
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
    component: BlankComponent,
    children: [
      {
        path: '',
        component: TaskItemComponent,
        resolve: {
          task: TaskResolver
        }
      },
      {
        path: 'archive',
        component: TaskArchiveComponent,
        resolve: {
          task: TaskResolver
        }
      },
      {
        path: 'report',
        component: TaskReportComponent,
        resolve: {
          task: TaskResolver
        }
      },
      {
        path: 'tags',
        component: TaskTagsSearchComponent,
        resolve: {
          task: TaskResolver
        }
      },
      {
        path: 'search/:query',
        component: TaskSearchComponent,
        resolve: {
          task: TaskResolver
        }
      }
    ]
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
