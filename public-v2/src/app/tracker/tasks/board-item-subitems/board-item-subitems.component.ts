import {Component, Input, OnInit, OnDestroy, OnChanges, SimpleChange} from "@angular/core";
import {TaskBoardItem} from "../../models/task-board-item";
import {LocalStorageService} from "angular-2-local-storage";
import {Subject} from "rxjs";

@Component({
  selector: 'board-item-subitems',
  templateUrl: 'board-item-subitems.component.html'
})

export class BoardItemSubitemsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() boardItem: TaskBoardItem | null;
  @Input() refreshCount;
  orderByPriority: string = 'desc';
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(private localStorageService: LocalStorageService) {}

  ngOnChanges(changes: { [refreshCount: number]: SimpleChange }): void {
  //   let prevValue = changes['refreshCount'].previousValue;
  //   let currValue = changes['refreshCount'].currentValue;
  //
  //   // if (prevValue !== currValue) {
  //    console.log('this.refreshCount', this.refreshCount);
  //    console.log('prevValue', prevValue);
  //    console.log('currValue', currValue);
  //   // }
  }

  ngOnInit(): void {
    this.orderByPriority = this.localStorageService.get('boardItems.orderByPriority') as string || 'desc';

    this.localStorageService.setItems$
      .takeUntil(this.componentDestroyed$)
      .subscribe((item) => {
        if (item && item.key === 'boardItems.orderByPriority') {
          this.orderByPriority = JSON.parse(item.newvalue);
        }
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
