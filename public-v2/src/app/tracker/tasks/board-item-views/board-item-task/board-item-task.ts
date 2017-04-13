import {Component, Input, OnInit} from "@angular/core";
import {Task} from "../../../models/task"
import {TaskBoardItem} from "../../../models/task-board-item";
import {TaskService} from "../../../services/task.service";
import {Subject} from "rxjs";
import {TaskWithStatus} from "../../../models/task-with-status";

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

  constructor(private taskService: TaskService) {}

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

  private actionProvider(taskWithStatus: TaskWithStatus): void|boolean {
    if (!taskWithStatus) {
      return false;
    }

    if (taskWithStatus.status === 'update') {
      if (this.boardItem.item._id === taskWithStatus.task._id) {
        this.boardItem.item = taskWithStatus.task;
      }

      this.taskSaveHandler();
    } else if (taskWithStatus.status === 'move') {
      this.taskSaveHandler();
    } else if (taskWithStatus.status === 'remove') {
      this.taskSaveHandler();
    } else if (taskWithStatus.status === 'close') {
      this.editMode = false;
    }
  }

  checkType(item) {
    return item.type === 'task';
  }
}
