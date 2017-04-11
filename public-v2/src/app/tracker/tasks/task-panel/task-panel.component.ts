import {Component, OnInit, Input} from '@angular/core';

import {Task} from '../../models/task'
import {TaskService} from "../../services/task.service";
import {isNull} from "util";
import {BoardItemService} from "../../services/board-item.service";
import {BasketService} from "../../services/basket.service";
import {TaskBoardItem} from "../../models/task-board-item";

@Component({
  selector: 'app-task-panel',
  templateUrl: 'task-panel.component.html'
})
export class TaskPanelComponent implements OnInit {
  @Input() task: Task;
  metricsDetails: number;
  showBasket: boolean = true;

  constructor(private taskService: TaskService,
              private  boardItemService: BoardItemService,
              private basketService: BasketService) {
  }

  ngOnInit() {
    this.taskService.taskMetricsViewType$
      .map(type => !isNull(type) ? type : 0)
      .subscribe(type => {
        this.metricsDetails = type;
      })
  }

  edit(task: Task) {
    this.taskService.setEditTaskModal(task);
  }

  moveToBasket(task: Task) {
    this.basketService.get()
      .subscribe((board) => {

        let boardItem = new TaskBoardItem();
        boardItem.board = board._id;
        boardItem.item = task._id;
        boardItem.type = "task";
        this.boardItemService.save(boardItem)
          .subscribe((response) => {
          this.showBasket = false;
              console.log('save to basket', response);
            },
            (err) => {
              console.log('err', err);
            })
      })
  }

}
