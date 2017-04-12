import {Component, OnInit, Input} from "@angular/core";
import {TaskBoardItem} from "../../../models/task-board-item";
import {TaskService} from "../../../services/task.service";

@Component({
  selector: 'board-item-subitems-task',
  templateUrl: 'board-item-subitems-task.component.html'
})

export class BoardItemSubitemsTaskComponent implements OnInit {
  @Input() parentBoardItem: TaskBoardItem | null;
  boardItems: TaskBoardItem[] = [];

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    let taskId = this.parentBoardItem && this.parentBoardItem.item && this.parentBoardItem.item._id ?
      this.parentBoardItem.item._id : this.parentBoardItem.item;

    this.taskService
      .getChildrenTasks(taskId)
      .toPromise()
      .then((tasks) => {
        this.boardItems = tasks.map((task) => {
          return {
            board: this.parentBoardItem.board,
            type: 'task',
            item: task
          }
        })
      })
      .catch((err) => console.log(err))
  }
}
