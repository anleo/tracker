import {Component, OnInit} from '@angular/core';

import {Task} from '../../models/task';
import {TaskEditClassService} from "../../services/task-edit-class.service";

@Component({
  selector: 'task-arch',
  template: '<h1>archive</h1><button (click)="getTasks()">GetTasks</button>' +
  '<ul><li *ngFor="let task of tasks">{{task.title}}</li></ul>',
  providers: [TaskEditClassService]
})

export class TaskEditArchiveClassComponent implements OnInit {
  place: string = 'archivedProject';
  taskId: string|null = null;
  tasks: Task[] = [];

  constructor(private taskEditClassService: TaskEditClassService) {
    this.taskEditClassService.tasks$.subscribe((tasks: Task[]) => this.tasks = tasks);
  }

  ngOnInit(): void {
    this.taskEditClassService.place = this.place;
    this.taskEditClassService.taskId = this.taskId;
    this.getTasks();
  }

  getTasks(): void {
    this.taskEditClassService.getTasks();
  }
}


// import {Component, OnInit, AfterContentChecked} from "@angular/core";
// import {ActivatedRoute} from "@angular/router";
// import {Location} from "@angular/common";
//
// import {TaskService} from "../../../services/task.service";
// import {Task} from '../../../models/task';
// import {BrowserTitleService} from "../../../../services/browser-title/browser-title.service";
//
// @Component({
//   moduleId: module.id,
//   templateUrl: 'task-archive.component.html'
// })
//
// export class TaskArchiveComponent implements OnInit {
//   taskId: string|null = null;
//   tasks: Task[] = [];
//   editTask$: Task|null;
//   editMode: boolean = false;
//
//   constructor(private route: ActivatedRoute,
//               private location: Location,
//               private browserTitleService: BrowserTitleService,
//               private taskService: TaskService,
//               private taskEditClassService: TaskEditClassService) {
//   }
//
//   ngOnInit(): void {
//     // this.taskService.editTaskModal$.subscribe((flag) => this.editMode = flag);
//     // this.taskService.editTask$.subscribe((task) => this.editTask$ = task);
//     let task = this.route.parent.snapshot.data['task'];
//
//     if (task) {
//       this.taskEditClassService.place = 'archivedTasks';
//       this.taskEditClassService.taskId = this.taskId;
//       this.taskEditClassService.getTasks().subscribe((tasks) => {
//         this.initTasks(tasks);
//         this.browserTitleService.setTitleWithPrefix('Archive', task.title);
//       });
//     } else {
//       this.taskEditClassService.place = 'archivedProject';
//       this.taskEditClassService.getTasks().subscribe((tasks) => this.initTasks(tasks))
//     }
//   }
//
//   initTasks(tasks: Task[]): void {
//     this.tasks = tasks;
//     this.taskService.setTasks(tasks);
//   }
// }
