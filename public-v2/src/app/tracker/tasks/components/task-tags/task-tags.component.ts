import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {Task} from "../../../models/task";
import {TaskService} from "../../../services/task.service";

@Component({
  selector: 'task-tags',
  templateUrl: 'task-tags.component.html'
})

export class TaskTagsComponent implements OnInit {
  @Input() task: Task;

  tag: string|null = null;
  tags: Array <{id: string, text: string}> = [];
  tagsList: Array <{id: string, text: string}> = [];
  selectedTags: Array <string> = [];
  alreadyIn: boolean = false;

  @Output() tasksUpdated = new EventEmitter();

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.loadTagsList();
    this.initSelectedTags();
  };

  initSelectedTags() {
    this.selectedTags = this.task.tags;
    this.tags = this.task.tags.map((tag) => {
      if (tag) {
        return this.convertTextToTags(tag);
      }
    });
  }

  private loadTagsList(): void {
    this.taskService
      .getTags(this.task)
      .map(tags => this.prepareTags(tags))
      .subscribe(tags => this.tagsList = tags);
  }

  public selected(tag: {id: string, text: string}): void {
    this.pushTagToField(this.selectedTags, tag.text);
    this.pushTagToField(this.tags, tag);
    this.task.tags = this.selectedTags;
    this.tasksUpdated.emit(this.task);
  }

  private pushTagToField(field, tag): void {
    let tagFound = field.find((_tag) => tag && tag.text ? _tag.text === tag.text : _tag === tag.text);
    if (!tagFound) {
      field.push(tag);
    }
  }

  private findAndRemoveTag(field, tag): void {
    let foundTag = field.find((_tag) => (_tag && _tag.text) ? _tag.text === tag.text : _tag === tag.text);
    let index = field.indexOf(foundTag);
    if (index > -1) {
      field.splice(index, 1);
    }
  }

  public removed(tag): void {
    this.findAndRemoveTag(this.task.tags, tag);
    this.findAndRemoveTag(this.tags, tag);
    this.tasksUpdated.emit(this.task);
  }

  protected prepareTags(tags): Array<{id: string, text: string}> {
    let tagsList = [];
    tags.forEach((tag) => tagsList.push({id: tag, text: tag}));

    return tagsList;
  }

  private convertTextToTags(tag: string) {
    return {id: tag, text: tag};
  }

  public addTag() {
    let tagFound = this.task.tagsList.find((tag) => tag === this.tag);
    if (!tagFound) {
      this.task.tagsList.push(this.tag);
    } else {
      this.alreadyIn = true;
      setTimeout(() => this.alreadyIn = false, 2000);
    }

    this.taskService.save(this.task).subscribe((task) => {
      this.task = task;
      this.loadTagsList();
      this.initSelectedTags();
      this.tasksUpdated.emit(this.task);
    });
    this.tag = null;
  }

  public onKey($event) {
    if ($event.key === 'Enter') {
      $event.preventDefault();
      $event.stopPropagation();
      this.addTag();
    }
  }
}
