import {Component, Input} from "@angular/core";
import {TaskComplexities} from './task-complexities';

@Component({
  selector: 'complexity',
  templateUrl: 'task-complexity.component.html'
})
export class TaskComplexityComponent {
  // @Input()
  complexities = TaskComplexities;

}
