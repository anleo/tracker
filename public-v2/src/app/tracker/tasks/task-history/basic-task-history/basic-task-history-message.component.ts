import {Input} from '@angular/core';
import {HistoryMessage} from "../../../models/history-message";

export class BasicHistoryComponent {
  @Input() message: HistoryMessage;
}
