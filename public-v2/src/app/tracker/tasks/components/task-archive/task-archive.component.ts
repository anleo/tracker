import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

import {TaskService} from "../../../services/task.service";
import {Task} from '../../../models/task';
import {BrowserTitleService} from "../../../../services/browser-title/browser-title.service";

@Component({
  moduleId: module.id,
  templateUrl: 'task-archive.component.html'
})

export class TaskArchiveComponent implements OnInit {
  tasks: Task[] = [];
  editMode: boolean = false;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private browserTitleService: BrowserTitleService,
              private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.taskService.editTaskModal$.subscribe((flag) => this.editMode = flag);
    let task = this.route.parent.snapshot.data['task'];

    if (task) {
      this.taskService.getArchivedTasks(task._id).subscribe((tasks) => {
        this.initTasks(tasks);
        this.browserTitleService.setTitleWithPrefix('Archive', task.title);
      });
    } else {
      this.taskService.getArchivedProjects().subscribe((tasks) => this.initTasks(tasks))
    }
  }

  initTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }

}
