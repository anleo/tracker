import {Component, OnInit} from '@angular/core';
import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-task-item',
  templateUrl: 'task-item.component.html'
})
export class TaskItemComponent implements OnInit {
  task: Task|null = null;
  parentTask: Task|null = null;
  root: Task|null = null;
  editTask: Task|null = null;
  tasks: Task[] = [];

  constructor(private route: ActivatedRoute,
              private taskService: TaskService) {

  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
        return this.taskService.getTask(params['taskId']);
      })
      .subscribe(task => {
        this.parentTask = null;
        this.root = null;
        this.tasks = [];

        this.task = task;
        let taskId = task && task._id ? task._id : null;

        this.loadTasks(taskId).subscribe(tasks => this.tasks = tasks);
        this.taskService.getRoot(taskId).subscribe((root) => this.root = root);

        if (task && task.parentTaskId) {
          this.taskService.getTask(task.parentTaskId).subscribe((parentTask) => this.parentTask = parentTask);
        }

        this.initTask();
      });
  }

  loadTasks(taskId: string): Observable<Task[]> {
    if (taskId) {
      return this.taskService.getChildrenTasks(taskId);
    } else {
      return this.taskService.getTasks();
    }
  }

  onUpdate(task: Task) {
    let tasks = this.tasks;
    this.tasks = [];

    if ('' + task._id === '' + this.task._id) {
      this.task = task;
    } else if (tasks.find((_task) => _task._id === task._id)) {
      tasks = tasks.map((_task) => {
        return ('' + _task._id === '' + task._id) ? task : _task;
      });
    } else {
      tasks.push(task);
    }

    setTimeout(() => {
      this.tasks = tasks;
      this.initTask();
    }, 0)
  }

  edit(task: Task) {
    this.editTask = task;
  }

  initTask() {
    this.editTask = new Task();
    if (this.task && this.task._id) {
      this.editTask.parentTaskId = this.task._id;
    }
  }

}
