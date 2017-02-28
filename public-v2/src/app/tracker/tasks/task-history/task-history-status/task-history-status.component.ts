import { Component } from '@angular/core';
import {BasicHistoryComponent} from "../basic-task-history/basic-task-history-message.component";

@Component({
  selector: 'task-history-status',
  templateUrl: './task-history-status.component.html'
})
export class TaskHistoryStatusComponent extends BasicHistoryComponent {
}
