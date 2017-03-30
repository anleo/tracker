import {Component} from "@angular/core";
import {DnDService} from "./dnd.service";

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
  constructor(private dnDService: DnDService) {
    this.dnDService.onDrop$.subscribe((dropData) => {
      if (dropData.params.status) {
        dropData.item.status = dropData.params.status;
      }

      if (dropData.params.toItem) {
        dropData.item.parentId = dropData.params.toItem;
      }
    })
  }

  tasks = Tasks;
  tasks2 = Tasks2;

  updateParent(data) {
    data.item.parentId = data.params.toItem;
  }

  updateStatus(data) {
    data.item.status = data.params.status;
  }
}
