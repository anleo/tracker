import {Component, OnInit, Input, HostListener, OnDestroy} from '@angular/core';
import {CurrentTaskService} from "../../services/current-task.service";
import {TaskBoard} from '../../models/task-board';
import {Subject, BehaviorSubject} from "rxjs";
import {BoardService} from "../../services/board.service";
import {TaskPrioritiesMock} from "../../mocks/task-priorities.mock";

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
  modalMode: boolean = false;
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
    this.boardService.editBoardModal$
      .takeUntil(this.componentDestroyed$)
      .subscribe((modalMode: boolean) => this.modalMode = modalMode);

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
    this.closeModal();
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
    this.closeModal();
    this.boardService.editBoardUpdated$.next({board: null, status: 'close'});
    setTimeout(() => this.initBoard(), 0);
  }

  remove(board: TaskBoard): void {
    this.boardService.removeBoard(board).subscribe(() => {
      this.boardService.editBoardUpdated$.next({board: board, status: 'remove'});
      this.closeModal();
      setTimeout(() => this.initBoard(), 0);
    });
  }

  private closeModal() {
    this.boardService.editBoardModal$.next(false);
  }

  setField(key: string, value: string): void {
    this.editBoard[key] = value;
  }

  boardChangeHandler(board: TaskBoard): void {
    this.editBoard = board;
  }

  checkInput(event) {
    let toggle = !!(event && event.target && event.target.value);
  }
}
