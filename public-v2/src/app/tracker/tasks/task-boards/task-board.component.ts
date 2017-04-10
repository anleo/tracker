import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs";

import {DnDService} from "../../dnd/dnd.service";
import {BoardItemService} from "../../services/board-item.service";
import {TaskBoardItem} from "../../models/task-board-item";

@Component({
  selector: 'task-board',
  templateUrl: 'task-board.component.html'
})

export class TaskBoardComponent implements OnInit, OnDestroy {
  boardItems: TaskBoardItem[] | null = [];

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


  constructor(private route: ActivatedRoute,
              private boardItemService: BoardItemService,
              private dndService: DnDService) {
  }

  ngOnInit(): void {
    console.log('init')
    this.getBoardItems();

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

  getBoardItems(): void {
    this.boardItemService.getBoardItemsByBoardId(this.route.snapshot.params['boardId']).subscribe((boardItems) => this.boardItems = boardItems);
  }

  private onDrop(dropData) {


    dropData.item.parent = dropData.params.parent ? dropData.params.parent :
      dropData.item.parent;
  }
}
