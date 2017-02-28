import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

import {TaskService} from "../../../services/task.service";
import {Task} from '../../../models/task';

@Component({
  moduleId: module.id,
  templateUrl: 'task-archive.component.html'
})

export class TaskArchiveComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private route: ActivatedRoute,
              private location: Location,
              private taskService: TaskService) {
  }

  ngOnInit(): void {
    let task = this.route.snapshot.data['task'];
    if (task) {
      console.log('with task', task);
    } else {
      this.taskService.getArchivedProject().subscribe((tasks) => this.tasks = tasks)
    }
  }
}
