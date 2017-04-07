import {Component, OnInit, OnDestroy} from "@angular/core";
import {BoardService} from "../../services/board.service";
import {TaskBoard} from "../../models/task-board";
import {CurrentTaskService} from "../../services/current-task.service";
import {DnDService} from "../../dnd/dnd.service";
import {Subject} from "rxjs";
import {Task} from "../../models/task";

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
      this.getBoards();
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

  getBoards(): void {
    this.boardService.getBoards(this.currentTaskService.task)
      .subscribe((boards) => this.boards = boards)
  }

  private onDrop(dropData) {
    let item : Task = dropData.item
    console.log('dropData.item', dropData.item, item instanceof Task);
    // if () {
    //
    // }

    dropData.item.parent = dropData.params.parent ? dropData.params.parent :
      dropData.item.parent;

    this.boardService.moveBoard(dropData.item._id, dropData.item.parent).toPromise().then(() => this.getBoards())
  }

  save(): void {
    this.boardService.saveBoard(this.newBoard).toPromise().then((board) => {
      this.boards.push(board);
      this.initBoard();
    });
  }

  initBoard(): void {
    this.newBoard = new TaskBoard();
    this.newBoard.project = this.currentTaskService.task._id;
  }
}
