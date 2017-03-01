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
  editMode: boolean = false;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.taskService.editTask$.subscribe((task) => this.editMode = !!(task && task.title));

    let taskId = this.route.snapshot.params['taskId'];
    if (taskId) {
      this.taskService.getArchivedTasks(taskId).subscribe((tasks) => this.initTasks(tasks))
    } else {
      this.taskService.getArchivedProjects().subscribe((tasks) => this.initTasks(tasks))
    }
  }

  initTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }

}
