import {Component, OnInit, Input} from '@angular/core';
import {Task} from "../../models/task";
import {TaskService} from "../../services/task.service";
import {HistoryMessage} from "../../models/history-message";
import {TaskHistoryCommentComponent} from "./task-history-comment/task-history-comment.component";
import {TaskHistoryDeveloperComponent} from "./task-history-developer/task-history-developer.component";
import {TaskHistoryComplexityComponent} from "./task-history-complexity/task-history-complexity.component";
import {TaskHistoryDescriptionComponent} from "./task-history-description/task-history-description.component";
import {TaskHistoryMetricsComponent} from "./task-history-metrics/task-history-metrics.component";
import {TaskHistorySpenttimeComponent} from "./task-history-spenttime/task-history-spenttime.component";
import {TaskHistoryStatusComponent} from "./task-history-status/task-history-status.component";

@Component({
  selector: 'task-history',
  templateUrl: './task-history.component.html',
  entryComponents: [
    TaskHistoryCommentComponent,
    TaskHistoryDeveloperComponent,
    TaskHistoryComplexityComponent,
    TaskHistoryDescriptionComponent,
    TaskHistoryMetricsComponent,
    TaskHistorySpenttimeComponent,
    TaskHistoryStatusComponent
  ]
})
export class TaskHistoryComponent implements OnInit {
  @Input() task: Task;
  messages: HistoryMessage[];
  allMessages: HistoryMessage[];

  constructor(public taskService: TaskService) {
  }

  ngOnInit() {
    this.taskService.getTaskHistory(this.task)
      .subscribe((messages) => {
        this.messages = messages;
        this.allMessages = messages;
      })
  }

  onSave(comment: HistoryMessage): void {
    this.allMessages.unshift(comment);
    this.findComments();
  }

  findAllMessages() {
    this.messages = this.allMessages.slice();
  }

  findComments() {
    this.messages = this.allMessages.slice();
    this.messages = this.messages.filter((message) => {
      return message._type == 'TaskComment';
    })
  }

  findOtherMessages() {
    this.messages = this.allMessages.slice();
    this.messages = this.messages .filter((message) => {
      return message._type !== 'TaskComment';
    })
  }

}
