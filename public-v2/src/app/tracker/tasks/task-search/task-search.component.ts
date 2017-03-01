import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {TaskSearchService} from "../../services/task-search.service";
import {Task} from "../../models/task";
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html'
})
export class TaskSearchComponent implements OnInit {
  tasks: Task[];
  search: string;

  constructor(private route: ActivatedRoute,
              private taskSearchService: TaskSearchService,
              private taskService: TaskService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        this.taskSearchService
          .search(params['query'], this.taskService.task)
          .then((tasks: Task[]) => {
            this.tasks = tasks;
          })
          .catch((err: any) => {
            this.toastr.error(err._body);
          });
      });
  }
}
