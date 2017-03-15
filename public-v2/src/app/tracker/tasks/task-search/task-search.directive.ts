import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/debounceTime";

import {CurrentTaskService} from "../../services/current-task.service";

@Component({
  selector: 'task-search',
  templateUrl: './task-search.directive.html'
})

export class TaskSearchDirective implements OnInit {
  taskId: string | null = null;
  query: string = '';
  focused: boolean = false;
  queryControl = new FormControl();

  constructor(private router: Router,
              private currentTaskService: CurrentTaskService) {
  }

  ngOnInit(): void {
    this.currentTaskService.task$.subscribe((task) => {
      this.taskId = task && task._id;

      if (!task) {
        this.query = '';
      }
    });

    this.queryControl
      .valueChanges
      .debounceTime(400)
      .subscribe(newValue => this.searchQuery(newValue));
  }

  searchQuery(query: string) {
    let q = query ? query : '';

    if (q.length && this.currentTaskService.task) {
      this.router.navigate(['/app/tasks', this.currentTaskService.task._id, 'search', q]);
    } else {
      this.router.navigate(['/app/tasks', this.currentTaskService.task._id]);
    }
  }
}
