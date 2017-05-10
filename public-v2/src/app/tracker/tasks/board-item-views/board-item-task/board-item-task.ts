import {Component, Input, OnInit} from "@angular/core";
import {Task} from "../../../models/task"
import {TaskBoardItem} from "../../../models/task-board-item";
import {TaskService} from "../../../services/task.service";
import {Subject} from "rxjs";
import {TaskWithStatus} from "../../../models/task-with-status";
import {BoardItemService} from "../../../services/board-item.service";
import {RefreshBoardItemService} from "../../../services/refresh-board-item.service";

@Component({
  selector: 'board-item-task',
  templateUrl: 'board-item-task.html'
})

export class BoardItemTaskComponent implements OnInit {
  @Input() boardItem: TaskBoardItem | null;
  showSubitems: boolean = false;
  refreshCount: number = null;
  editMode: boolean = false;

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private taskService: TaskService,
              private boardItemService: BoardItemService,
              private refreshBoardItemService: RefreshBoardItemService) {
  }

  ngOnInit(): void {
    this.taskService.editTaskUpdated$
      .takeUntil(this.componentDestroyed$)
      .subscribe((taskWithStatus: TaskWithStatus) => this.actionProvider(taskWithStatus));

    this.taskService.editTaskModal$
      .takeUntil(this.componentDestroyed$)
      .subscribe((flag) => this.editMode = flag);
  }

  edit(task: Task) {
    this.taskService.setEditTaskModal(task);
  }

  taskSaveHandler(): void {
    this.refreshCount++;
  }

  toggleSubitems(): void {
    this.showSubitems = !this.showSubitems;
  }

  checkType(item) {
    return item.type === 'task';
  }

  removeBoardItem(boardItem: TaskBoardItem): void {
    this.boardItemService.remove(boardItem);
    this.refreshBoardItemService.onChangeItem$.next(this.boardItem);
  };

  private actionProvider(taskWithStatus: TaskWithStatus): void|boolean {
    if (!taskWithStatus) {
      return false;
    }

    if (taskWithStatus.status === 'update') {
      this.onUpdate(taskWithStatus);
    } else if (taskWithStatus.status === 'move') {
      this.onMove(taskWithStatus);
    } else if (taskWithStatus.status === 'remove') {
      this.onRemove(taskWithStatus);
    } else if (taskWithStatus.status === 'close') {
      this.editMode = false;
    }
  }

  private onRemove(taskWithStatus: TaskWithStatus) {
    if (this.amI(taskWithStatus)) {
      this.refreshBoardItemService.onChangeItem$.next(this.boardItem);
    }

    this.taskSaveHandler();
  }

  private onMove(taskWithStatus: TaskWithStatus) {
    if (this.amI(taskWithStatus)) {
      this.refreshBoardItemService.onChangeItem$.next(this.boardItem);
    }

    this.taskSaveHandler();
  }

  private onUpdate(taskWithStatus: TaskWithStatus) {
    if (this.amI(taskWithStatus)) {
      this.boardItem.item = taskWithStatus.task;
      this.refreshBoardItemService.onChangeItem$.next(this.boardItem);
    }

    this.taskSaveHandler();
  }

  private amI(taskWithStatus: TaskWithStatus) {
    return this.boardItem.item._id === taskWithStatus.task._id;
  }

}
