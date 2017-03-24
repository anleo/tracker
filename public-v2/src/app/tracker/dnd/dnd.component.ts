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

  updateTasks(item) {
    if (this.tasks.indexOf(item) >= 0) {
      this.tasks.splice(this.tasks.indexOf(item), 1);
      this.tasks2.push(item);
      this.tasks2 = _.uniq(this.tasks2, (task) => task.id);
    }


    if (this.tasks2.indexOf(item) >= 0) {
      this.tasks2.splice(this.tasks2.indexOf(item), 1);
      this.tasks.push(item);
      this.tasks = _.uniq(this.tasks, (task) => task.id);
    }
  }

  updateParent(data) {
    data.item.parentId = data.params.toItem;
    this.updateTasks(data.item);
  }

  updateStatus(data) {
    data.item.status = data.params.status;
  }
}
