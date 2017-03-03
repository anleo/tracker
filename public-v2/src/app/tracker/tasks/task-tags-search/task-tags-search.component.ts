import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
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
              private location: Location,
              private browserTitleService: BrowserTitleService) {}

  ngOnInit(): void {
    this.task = this.route.parent.snapshot.data['task'];
    let currentTag = this.route.snapshot.params['tag'];

    this.contextTaskService
      .getTags(this.task)
      .subscribe(tags => {
        this.availableTags = tags;

        if (this.inListTags(this.availableTags, currentTag)) {
          this.toggleTag(currentTag);
        }
      });

    this.browserTitleService.setTitle('Search by tags');
  }

  toggleTag(tag: string): void {
    if (!this.inListTags(this.selectedTags, tag)) {
      this.selectedTags.push(tag)
    } else {
      delete this.selectedTags[this.selectedTags.indexOf(tag)];
    }

    if (Object.keys(this.selectedTags).length) {
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

  isActiveTag(tag: string): boolean {
    return this.inListTags(this.selectedTags, tag);
  }

  private inListTags(tags: Array<string>, tag: string): boolean {
    return tags.find(found => found === tag) ? true : false;
  }
}
