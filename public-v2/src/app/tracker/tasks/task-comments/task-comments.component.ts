import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TaskService} from "../../services/task.service";
import {Task} from "../../models/task";
import {HistoryMessage} from "../../models/history-message";

@Component({
  selector: 'comments',
  templateUrl: 'task-comments.component.html'
})
export class CommentsComponent implements OnInit {
  @Input() task: Task;
  @Output() savedComment: EventEmitter<HistoryMessage> = new EventEmitter();
  comment: HistoryMessage;

  constructor(public taskService: TaskService) {
  }

  saveComment($event): void {
    if ($event.keyCode == 13 && $event.shiftKey) {
      this.createComment();
    }
  }

  createComment(): void {
    this.taskService.createComment(this.task, this.comment)
      .subscribe((comment) => {
        this.savedComment.emit(comment);
        this.comment = new HistoryMessage();
        this.taskService.editTaskUpdated$.next({task: this.task, status: 'update'});
      });
  }

  ngOnInit() {
    this.comment = new HistoryMessage();
  }

}
