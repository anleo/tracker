import {Component} from "@angular/core";
import * as _ from 'lodash';

const Tasks = [
  {id: 1, title: 'task 1', status: 'new'},
  {id: 2, title: 'task 2', status: 'new'},
  {id: 3, title: 'task 3', status: 'new'}
];

const Tasks2 = [
  {id: 33, title: 'task 33', status: 'accepted'}
];

@Component({
  moduleId: module.id,
  templateUrl: 'dnd.component.html'
})

export class DndComponent {
  tasks = Tasks;
  tasks2 = Tasks2;

  updateParent(data) {
    data.item.parentId = data.params.toItem;
  }

  updateStatus(data) {
    data.item.status = data.params.status;
  }
}
