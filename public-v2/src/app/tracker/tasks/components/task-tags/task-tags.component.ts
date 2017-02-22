import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {Task} from "../../../models/task";
import {TaskService} from "../../../services/task.service";

@Component({
  selector: 'task-tags',
  templateUrl: 'task-tags.component.html'
})

export class TaskTagsComponent implements OnInit {
  @Input() task: Task;

  tags: Array <{id: string, text: string}> = [];
  tagsList: Array <{id: string, text: string}> = [];
  selectedTags: Array <string> = [];

  addButton: boolean = false;
  tagToAdd: string|null = null;

  @Output() tasksUpdated = new EventEmitter();

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.loadTagsList();
  };

  loadTagsList():void {
    this.taskService
      .getTags(this.task)
      .map(tags => this.prepareTags(tags))
      .subscribe(tags => {
        tags.map(tag => this.selectedTags.push(tag.text));

        this.tagsList = tags;
      });
  }

  public selected(tag:  {id: string, text: string}): void {
    this.selectedTags.push(tag.text);
    this.task.tags = this.selectedTags;
    this.tasksUpdated.emit(this.task);
  }

  public removed(tag): void {
    this.tags.filter((_tag, index) => {
      if (_tag === tag) {
        delete this.task.tags[index];
      }
    });
    this.tasksUpdated.emit(this.task);
  }

  public addTag() {
    if (this.tagToAdd) {
      this.task.tags.push(this.tagToAdd);
      this.taskService.save(this.task).subscribe((task) => {
        this.task = task;
        this.loadTagsList();
        this.tasksUpdated.emit(this.task);
      });
      this.tagToAdd = null;
    }
  }

  protected prepareTags(tags): Array<{id: string, text: string}> {
    let tagsList = [];
    tags.forEach((tag) => tagsList.push({id: tag, text: tag}));

    return tagsList;
  }

  public checkTag(tag):void {
    let foundTag = this.tagsList.find((_tag) => tag === _tag.text);

    if (!foundTag) {
      this.tagToAdd = tag;
      this.addButton = true;
    } else {
      this.tagToAdd = null;
      this.addButton = true;
    }
  }

}
