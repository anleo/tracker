import {ActivatedRoute, Params, Router} from "@angular/router";
import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {Task} from '../../models/task';
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-task-item',
  templateUrl: 'task-item.component.html'
})
export class TaskItemComponent implements OnInit {
  task: Task|null = null;
  parentTask: Task|null = null;
  root: Task|null = null;
  tasks: Task[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private taskService: TaskService) {
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
        if (params['taskId']) {
          return this.taskService.getTask(params['taskId']);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe(task => {
        this.taskService.taskMoved$
          .subscribe(task => this.onTaskMoved(task));
        this.init(task);
      });
  }

  init(task) {
    this.parentTask = null;
    this.root = null;
    this.tasks = [];

    this.task = task;
    let taskId = task && task._id ? task._id : null;

    this.loadTasks(taskId).subscribe(tasks => this.tasks = tasks);
    taskId && this.taskService.getRoot(taskId).subscribe((root) => this.root = root);

    if (task && task.parentTaskId) {
      this.taskService.getTask(task.parentTaskId).subscribe((parentTask) => this.parentTask = parentTask);
    }

    this.initEditTask();
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
    let taskFound = tasks.find((_task) => _task._id === task._id);

    if (this.task && this.task._id === task._id) {
      this.task = task;
    } else {
      if (taskFound) {
        tasks = tasks.map((_task) => {
          if (_task._id === task._id) {
            _task = task;
          }
          return _task;
        });
      } else {
        tasks.push(task);
      }
    }

    setTimeout(() => {
      this.tasks = tasks;
      this.initEditTask();
    }, 0)
  }

  onRemove(task: Task) {
    let tasks = this.tasks;
    this.tasks = [];

    if (this.task && this.task._id === task._id) {
      if (this.parentTask && this.parentTask._id) {
        this.router.navigateByUrl('/app/tasks/' + this.parentTask._id);
      } else {
        this.router.navigateByUrl('/app/tasks/');
      }
    } else {
      let index = tasks.indexOf(task);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    }

    setTimeout(() => {
      this.tasks = tasks;
      this.initEditTask();
    }, 0);
  }

  edit(task: Task) {
    this.taskService.setEditTask(task);
  }

  initEditTask() {
    let editTask = new Task();

    if (this.task && this.task._id) {
      editTask.parentTaskId = this.task._id;
    }

    this.taskService.setEditTask(editTask);
  }

  onTaskMoved(task) {
    if (task) {
      this.tasks = this.tasks.filter(item => item._id !== task._id);
    }
  }

}
