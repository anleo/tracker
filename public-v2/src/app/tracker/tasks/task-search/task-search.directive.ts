import {Component, OnInit, Inject} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/debounceTime";

import {ROOT_TASKSERVICE} from "../../../app.tokens";

@Component({
  selector: 'task-search',
  templateUrl: './task-search.directive.html'
})

export class TaskSearchDirective implements OnInit {
  query: string = '';
  focused: boolean = false;
  queryControl = new FormControl();

  constructor(private router: Router,
              @Inject(ROOT_TASKSERVICE) private rootTaskService) {
  }

  ngOnInit(): void {
    this.queryControl
      .valueChanges
      .debounceTime(400)
      .subscribe(newValue => this.searchQuery(newValue));
  }

  searchQuery(query: string) {
    let q = query ? query : '';

    if (q.length && this.rootTaskService.task) {
      this.router.navigate(['/app/tasks', this.rootTaskService.task._id, 'search', q]);
    } else {
      this.router.navigate(['/app/tasks', this.rootTaskService.task._id]);
    }
  }
}
