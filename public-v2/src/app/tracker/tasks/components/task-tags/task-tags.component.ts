import {
  Component, Input, OnInit, Output, EventEmitter, ElementRef} from "@angular/core";
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
  addedTag: boolean = false;
  notInList: boolean;

  @Output() tasksUpdated = new EventEmitter();

  constructor(private taskService: TaskService,
              private elementRef : ElementRef) {
  }

  ngOnInit(): void {
    let parentTaskId = this.task && this.task.parentTaskId;
    if (parentTaskId) {
      this.task.parentTaskId = parentTaskId;
    }

    this.loadTagsList();
    this.initSelectedTags();
  };

  private initSelectedTags() {
    this.selectedTags = this.task && this.task.tags || [];
    this.tags = this.task.tags && this.task.tags.map((tag) => {
        if (tag) {
          return this.convertTextToTags(tag);
        }
      });
  }

  private loadTagsList(): void {
    let _root = (this.task && this.task._id) || (this.task && this.task.parentTaskId);

    if (this.task && this.task._id) {
      this.taskService
        .getTags(this.task)
        .map(tags => this.prepareTags(tags))
        .subscribe(tags => this.tagsList = tags);
    } else {
      if (_root) {
        this.taskService
          .getRoot(_root)
          .map((root) => root.tagsList || [])
          .map(tags => this.prepareTags(tags))
          .subscribe(tags => this.tagsList = tags);
      } else {
        this.tagsList = [];
      }
    }
  }

  public selected(tag: {id: string, text: string}): void {
    this.pushTagToField(this.selectedTags, tag.text);
    this.pushTagToField(this.tags, tag);
    this.task.tags = this.selectedTags;
    this.tasksUpdated.emit(this.task);
  }

  private pushTagToField(field, tag): void {
    let tagFound = field && field.find((_tag) => tag && tag.text ? _tag.text === tag.text : _tag === tag.text);
    if (!tagFound) {
      field.push(tag);
    }
  }

  private findAndRemoveTag(field, tag): void {
    let foundTag = field && field.find((_tag) => (_tag && _tag.text) ? _tag.text === tag.text : _tag === tag.text);
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
    let root = (this.task && this.task._id) || (this.task && this.task.parentTaskId);

    this.taskService.getRoot(root)
      .subscribe((root) => {
        let tagFound = root.tagsList && root.tagsList.find((tag) => tag === this.tag);
        if (!tagFound) {
          root.tagsList && root.tagsList.push(this.tag);
          this.taskService.save(root).subscribe(() => {
            this.addedTag = true;
            this.loadTagsList();
            this.initSelectedTags();
            this.tags.push({id: this.tag, text: this.tag});
            this.selectedTags.push(this.tag);
            this.tag = null;
            this.elementRef.nativeElement.querySelector('.ng-select input').focus();
            this.elementRef.nativeElement.querySelector('.ng-select input').value = null;
            setTimeout(() => this.addedTag = false, 2000);
          });
        } else {
          this.alreadyIn = true;
          this.tag = null;
          setTimeout(() => this.alreadyIn = false, 2000);
        }
      });
  }

  public typed($event) {
    this.tag = $event.trim();
    this.notInList = true;
    this.tagsList.forEach((tag) => {
      if (tag && tag.text.toString() === $event.toString()) {
        this.notInList = false;
      }
    });
  }
}
