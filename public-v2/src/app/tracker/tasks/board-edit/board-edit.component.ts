import {Component, OnInit, Input, HostListener, OnDestroy} from '@angular/core';
import {CurrentTaskService} from "../../services/current-task.service";
import {TaskBoard} from '../../models/task-board';
import {Subject, BehaviorSubject} from "rxjs";
import {BoardService} from "../../services/board.service";
import {TaskPrioritiesMock} from "../../mocks/task-priorities.mock";

// import {BoardItemService} from "../../services/board-item.service";
// import {TaskBoardItem} from '../../models/task-board-item';
// import {TaskStatus} from '../../models/task-status';
// import {TaskService} from "../../services/task.service";
// import {TaskStatusService} from "../../services/task-status.service";

@Component({
  selector: 'board-edit',
  templateUrl: 'board-edit.component.html',
  host: {
    '(document:keyup)': 'onKeyUp($event)'
  }
})
export class BoardEditComponent implements OnInit, OnDestroy {
  @Input() parentBoard: TaskBoard|null = null;
  editBoard: TaskBoard|null = null;
  priorities: number[] = TaskPrioritiesMock;
  project: any;
  $onDestroy: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private currentTaskService: CurrentTaskService,
              private boardService: BoardService) {
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode == 27) {
      this.close();
    }
  }

  ngOnInit(): void {
    this.boardService.editBoard$.subscribe((board) => this.editBoard = board);
    this.currentTaskService.rootTask$.subscribe((rootTask) => {
      this.project = rootTask;
      this.initBoard();
    });
  }

  initBoard(): void {
    this.editBoard = new TaskBoard();
    this.editBoard.project = this.project && this.project._id;
    this.boardService.editBoard$.next(this.editBoard);
  }

  ngOnDestroy(): void {
    this.$onDestroy.next(true);
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  save(): void {
    let parentBoardId = this.parentBoard && this.parentBoard._id || null;
    this.boardService
      .saveChildBoard(this.editBoard, parentBoardId)
      .toPromise()
      .then((board) => {
        this.boardService.editBoardUpdated$.next({board: board, status: 'update'});
        this.initBoard();
      });
  }

  close(): void {
    this.boardService.editBoardUpdated$.next({board: null, status: 'close'});
    setTimeout(() => this.initBoard(), 0);
  }

  setField(key: string, value: string): void {
    this.editBoard[key] = value;
  }

  // reinitTask(task: Task): void {
  //   this.closeModal();
  //   this.taskService.editTaskUpdated$.next({task: task, status: 'update'});
  //   setTimeout(() => this.initTask(), 0);
  // }

  // save(): void {
  //   if (this.task && this.task.parentTaskId) {
  //     this.taskService.saveChildTask(this.task).subscribe((task) => this.reinitTask(task));
  //   } else {
  //     this.taskService.save(this.task).subscribe((task) => this.reinitTask(task));
  //   }
  // }

  // remove(task: Task): void {
  //   this.taskService.remove(this.task).subscribe(() => {
  //     this.closeModal();
  //     this.taskService.editTaskUpdated$.next({task: task, status: 'remove'});
  //     setTimeout(() => this.initTask(), 0);
  //   });
  // }
  //
  // onMove(task: Task): void {
  //   this.closeModal();
  //   this.taskService.editTaskUpdated$.next({task: task, status: 'move'});
  //   setTimeout(() => this.initTask(), 0);
  // }
  //
  //
  // setField(key: string, value: string): void {
  //   this.task[key] = value;
  // }
  //
  // taskChangeHandler(task: Task): void {
  //   this.task = task;
  // }
  //
  // handleOnUpload(file: any): void {
  //   this.task.files.push(file);
  // }
  //
  // handleOnDelete(file: any): void {
  //   this.taskService.deleteFile(file, this.task)
  //     .subscribe(() => {
  //       this.task.files.splice(this.task.files.indexOf(file), 1);
  //       this.toastr.error('Deleted');
  //     })
  // }
  //
  // showTaskMove(): void {
  //   this.taskMoveToggle = !this.taskMoveToggle;
  // }
  //
  // private closeModal() {
  //   this.taskService.editTaskModal$.next(false);
  // }
  //
  checkInput(event) {
    let toggle = !!(event && event.target && event.target.value);
    // this.taskService.editTaskToggle$.next(toggle);
  }
}
