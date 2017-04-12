import {Component, OnInit, OnDestroy, ViewContainerRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs";
import * as _ from 'lodash';

import {DnDService} from "../../dnd/dnd.service";
import {BoardItemService} from "../../services/board-item.service";
import {TaskBoardItem} from "../../models/task-board-item";
import {Task} from '../../models/task';
import {CurrentTaskService} from "../../services/current-task.service";

import {ToastsManager} from 'ng2-toastr/ng2-toastr';


@Component({
  selector: 'task-board',
  templateUrl: 'task-board.component.html',
  providers: [DnDService]
})

export class TaskBoardComponent implements OnInit, OnDestroy {
  boardItems: TaskBoardItem[] | null = [];
  project: Task | null = null;
  boardId: string | null = null;

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
    }];


  constructor(private route: ActivatedRoute,
              private currentTaskService: CurrentTaskService,
              private boardItemService: BoardItemService,
              private dndService: DnDService,
              public toastr: ToastsManager,
              vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.boardId = params['boardId'];
      this.getBoardItems();
    });

    this.dndService.onDrop$
      .takeUntil(this.componentDestroyed$)
      .subscribe((dropData) => {
        this.onDrop(dropData);
      });

    this.currentTaskService.task$
      .takeUntil(this.componentDestroyed$)
      .subscribe((task) => this.project = task || null);
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  getBoardItems(): void {
    this.boardItemService.getBoardItemsByBoardId(this.route.snapshot.params['boardId']).subscribe((boardItems) => this.boardItems = boardItems);
  }

  private onDrop(dropData) {
    let newBoardItem = _.pick(dropData.item, ['board', 'item', 'type']);
    newBoardItem['board'] = dropData.params.parent;

    this.boardItemService.save(newBoardItem).toPromise()
      .then((boardItem) => console.log(boardItem))
      .catch((err) => this.toastr.error(JSON.parse(err._body)));
  }
}
