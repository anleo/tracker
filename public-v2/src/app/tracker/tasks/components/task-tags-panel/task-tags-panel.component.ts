import {Component, Input} from "@angular/core";
import {Task} from "../../../models/task";

@Component({
  selector: 'task-tags-panel',
  templateUrl: 'task-tags-panel.component.html'
})

export class TaskTagsPanelComponent {
  @Input() task: Task;
}
