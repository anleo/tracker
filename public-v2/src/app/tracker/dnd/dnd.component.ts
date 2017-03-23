import {Component} from "@angular/core";

const Tasks = [
  {id: 1, title: 'task 1'},
  {id: 2, title: 'task 2'},
  {id: 3, title: 'task 3'}
];

const Tasks2 = [
  {id: 33, title: 'task 33'}
];

@Component({
  moduleId: module.id,
  templateUrl: 'dnd.component.html'
})

export class DndComponent {
  tasks = Tasks;
  tasks2 = Tasks2;

  updateTasks(item) {
    this.tasks.splice(this.tasks.indexOf(item), 1);
    this.tasks2.push(item);
  }

  updateParent(data) {
    data.item.parentId = data.params.toItem;
    this.updateTasks(data.item);
  }

  updateStatus(data) {
    data.item.status = data.params.status;
    this.updateTasks(data.item);
  }
}
