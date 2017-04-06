import {Component, OnInit, OnDestroy} from "@angular/core";
import {BoardService} from "../../services/board.service";
import {TaskBoard} from "../../models/task-board";
import {CurrentTaskService} from "../../services/current-task.service";
import {DnDService} from "../../dnd/dnd.service";
import {Subject} from "rxjs";

@Component({
  selector: 'task-boards',
  templateUrl: 'task-boards.component.html'
})

export class TaskBoardsComponent implements OnInit, OnDestroy {
  boards: TaskBoard[] | null = [];
  newBoard: TaskBoard | null;

  componentDestroyed$: Subject<boolean> = new Subject();

  statusTypess = [{
    id: 'new',
    name: 'New',
    value: ''
  },
    {
      id: 'in_progress',
      name: 'In progress',
      value: 'in progress'
    },
    {
      id: 'accepted',
      name: 'Accepted',
      value: 'accepted'
    }]


  constructor(private boardService: BoardService,
              private currentTaskService: CurrentTaskService,
              private dndService: DnDService) {
  }

  ngOnInit(): void {
    this.currentTaskService.task$.subscribe((task) => {
      if (!task) {
        return;
      }

      this.initBoard();


      this.boardService.getBoards(task)
        .subscribe((boards) => this.boards = boards)
    });

    this.dndService.onDrop$
      .takeUntil(this.componentDestroyed$)
      .subscribe((dropData) => {
        this.onDrop(dropData);
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  private onDrop(dropData) {
    console.log(111)
    // dropData.item.parentTaskId = dropData.params.parentTaskId ? dropData.params.parentTaskId :
    //   dropData.item.parentTaskId;
    //
    // if (dropData.params.status) {
    //   let status = dropData.params.status.id === 'new' ? '' : dropData.params.status.value;
    //   dropData.item.status = status;
    // }

    // this.taskService.updateTask(dropData.item).toPromise().then((task) => this.search())
  }

  save(): void {
    this.boardService.saveBoard(this.newBoard)
  }

  initBoard(): void {
    this.newBoard = new TaskBoard();
    this.newBoard.project = this.currentTaskService.task._id;
  }
}
