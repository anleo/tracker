import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class RefreshBoardItemService {
  onChangeItem$: Subject<any> = new Subject<any>();
  refreshRoot$: Subject<any> = new Subject<any>();
}
