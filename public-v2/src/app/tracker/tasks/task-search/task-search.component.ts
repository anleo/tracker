import {Component, OnInit, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import {TaskSearchService} from "../../services/task-search.service";
import {Task} from "../../models/task";
import {TaskService} from "../../services/task.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html'
})
export class TaskSearchComponent implements OnInit {
  tasks: Task[];
  taskId: string;
  query: string;
  editMode: boolean = false;

  constructor(private route: ActivatedRoute,
              private taskSearchService: TaskSearchService,
              private taskService: TaskService,
              public toastr: ToastsManager,
              private location: Location,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.taskService.editTaskModal$.subscribe((flag) => this.editMode = flag);
    this.taskId = this.taskService.task && this.taskService.task._id;

    this.taskId && this.route.params
      .subscribe((params: Params) => {
        this.taskSearchService
          .search(params['query'], this.taskService.task)
          .then((tasks: Task[]) => {
            this.query = params['query'];
            this.tasks = tasks;
          })
          .catch((err: any) => {
            this.toastr.error(err._body);
          });
      });
  }
}
