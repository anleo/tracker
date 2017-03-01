import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import {TaskService} from "../../services/task.service";
import {FormControl} from "@angular/forms";
import "rxjs/add/operator/debounceTime";

@Component({
  selector: 'task-search',
  templateUrl: './task-search.directive.html'
})

export class TaskSearchDirective implements OnInit {
  query: string = '';
  focused: boolean = false;
  queryControl = new FormControl();


  constructor(private router: Router,
              private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.queryControl
      .valueChanges
      .debounceTime(400)
      .subscribe(newValue => this.searchQuery(newValue));
  }

  searchQuery(query: string) {
    let q = query ? query : '';

    if (q.length && this.taskService.task) {
      this.router.navigate(['/app/tasks', this.taskService.task._id, 'search', q]);
    } else {
      this.router.navigate(['/app/tasks', this.taskService.task._id]);
    }
  }
}
