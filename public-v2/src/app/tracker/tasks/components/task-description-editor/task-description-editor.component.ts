import {Component, Input, OnInit, EventEmitter, Output} from "@angular/core";
import {Task} from "../../../models/task";

@Component({
  selector: 'task-description-editor',
  templateUrl: 'task-description-editor.component.html'
})

export class TaskDescriptionEditor implements OnInit{
  @Input() task: Task;

  description:string = '';

  @Output() descriptionUpdated: EventEmitter <Task> = new EventEmitter();

  ngOnInit(): void {
    this.description = this.task.description || '';
  }

  onChange($event): void {
    this.description = $event;
    this.task.description = this.description;
    this.descriptionUpdated.emit(this.task);
  }
}
