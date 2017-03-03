import {Component, OnInit, AfterContentChecked} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

import {TaskService} from "../../../services/task.service";
import {Task} from '../../../models/task';
import {BrowserTitleService} from "../../../../services/browser-title/browser-title.service";

@Component({
  moduleId: module.id,
  templateUrl: 'task-archive.component.html'
})

export class TaskArchiveComponent implements OnInit, AfterContentChecked {
  tasks: Task[] = [];
  editTask$: Task|null;
  editMode: boolean = false;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private browserTitleService: BrowserTitleService,
              private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.taskService.editTaskModal$.subscribe((flag) => this.editMode = flag);
    this.taskService.editTask$.subscribe((task) => this.editTask$ = task);
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

  ngAfterContentChecked() {
    if (this.editTask$ && !this.editTask$.archived) {
      this.tasks = this.tasks.filter((task) => task._id !== this.editTask$._id);
    }
  }

  initTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }

}
