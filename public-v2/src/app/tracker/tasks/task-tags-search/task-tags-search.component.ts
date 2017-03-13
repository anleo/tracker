import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

import {TaskService} from "../../services/task.service";
import {Task} from "../../models/task";
import {BrowserTitleService} from "../../../services/browser-title/browser-title.service";

@Component({
  templateUrl: 'task-tags-search.component.html',
  providers: [TaskService]
})

export class TaskTagsSearchComponent implements OnInit {
  availableTags: Array<string> = [];
  selectedTags: Array<string> = [];
  tasks: Task[] = [];
  task: Task;

  constructor(private contextTaskService: TaskService,
              private route: ActivatedRoute,
              private router: Router,
              private browserTitleService: BrowserTitleService) {
  }

  ngOnInit(): void {
    this.task = this.route.snapshot.data['task'];

    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.selectedTags = this.route.snapshot.queryParams['tags'] ?
            this.route.snapshot.queryParams['tags'].split(',') : [];

          this.getTasks();
        }
      });

    this.contextTaskService
      .getTags(this.task)
      .subscribe(tags => this.availableTags = tags);

    this.browserTitleService.setTitle('Search by tags');
  }

  toggleTag(tag: string): void {
    if (!this.inListTags(this.selectedTags, tag)) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
    }

    this.getTasks();
    this.navigateWithTags();
  }

  private getTasks(): void {
    if (this.selectedTags.length) {
      this.contextTaskService
        .getTasksByTags(this.task._id, this.selectedTags)
        .subscribe(tasks => {
          this.tasks = tasks;
          this.contextTaskService.setTasks(tasks);
        });
    } else {
      this.tasks = [];
    }
  }

  private navigateWithTags(): void {
    if (this.selectedTags.length) {
      this.router.navigate(['/app/tasks', this.task._id, 'tags'], {queryParams: {tags: this.selectedTags}});
    } else {
      this.router.navigate(['/app/tasks', this.task._id, 'tags']);
    }
  }

  isActiveTag(tag: string): boolean {
    return this.inListTags(this.selectedTags, tag);
  }

  private inListTags(tags: Array<string>, tag: string): boolean {
    return tags.find(found => found === tag) ? true : false;
  }
}
