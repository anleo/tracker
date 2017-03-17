import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
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
import {SocketService} from "../../../services/socket.service";

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
export class TaskHistoryComponent implements OnInit,OnDestroy {
  @Input() task: Task;
  messages: HistoryMessage[];
  allMessages: HistoryMessage[];
  $onDestroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentView: string = 'allMessages';

  constructor(public taskService: TaskService,
              private socketService: SocketService) {
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
  }

  ngOnInit() {
    this.loadHistory();

    let self = this;
    this.socketService.scopeOn(self, 'comment.save', (data) => {
      if (this.task && this.task._id === data.task) {
        self.loadHistory();
      }
    });
  }

  private loadHistory(): void {
    this.taskService.getTaskHistory(this.task)
      .subscribe((messages) => {
        this.messages = messages;
        this.allMessages = messages;
      })
  }

  onSave(comment: HistoryMessage): void {
    this.allMessages.unshift(comment);
    this.findAllMessages();
  }

  findAllMessages() {
    this.currentView = 'allMessages';
    this.messages = this.allMessages.slice();
  }

  findComments() {
    this.currentView = 'comments';
    this.messages = this.allMessages.slice();
    this.messages = this.messages.filter((message) => {
      return message._type == 'TaskComment';
    });

  }

  findOtherMessages() {
    this.currentView = 'otherMessages';
    this.messages = this.allMessages.slice();
    this.messages = this.messages.filter((message) => {
      return message._type !== 'TaskComment';
    })
  }

}
