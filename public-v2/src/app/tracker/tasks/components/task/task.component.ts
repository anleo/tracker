import {Component, OnDestroy} from "@angular/core";
import {CurrentTaskService} from "../../../services/current-task.service";

@Component({
  template: `<router-outlet></router-outlet>`
})

export class TaskComponent implements OnDestroy {
  constructor(private currentTaskService: CurrentTaskService) {
  }

  ngOnDestroy(): void {
    this.currentTaskService.task$.next(null);
    this.currentTaskService.rootTask$.next(null);
    this.currentTaskService.parentTask$.next(null);
  }
}
