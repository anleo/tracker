import {NgModule} from "@angular/core";
import {RouterModule, Routes} from '@angular/router';
import {TasksComponent} from "./tasks/tasks.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: '**',
    redirectTo: 'tasks'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrackerRoutingModule {
}
