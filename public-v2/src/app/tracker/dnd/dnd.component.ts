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
  tasks3 = Tasks2;

  someAction($event) {
    this.tasks2.push(null)
  }

}
