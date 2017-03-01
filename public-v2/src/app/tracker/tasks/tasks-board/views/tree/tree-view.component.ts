import {Component} from '@angular/core';

import {TaskService} from "../../../../services/task.service";
import {TaskStatusService} from "../../../../services/task-status.service";
import {BoardBaseComponent} from "../../board-base.component";
import {Task} from "../../../../models/task";

@Component({
  selector: 'tree-view',
  templateUrl: 'tree-view.component.html'
})
export class TreeViewComponent extends BoardBaseComponent {
  tree: Task[] = [];

  constructor(protected taskService: TaskService,
              protected taskStatusService: TaskStatusService) {
    super(taskService, taskStatusService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.tree = this.buildTree(this.tree, this.tasks);
  }

  private buildTree(tree: Task[], tasks: Task[]): Task[] {
    tasks.forEach(task => {
      if (!task.simple) {
        task.subTasks = [];

        this.taskService
          .getChildrenTasks(task._id)
          .subscribe(subTasks => {
            task.subTasks = this.buildTree([], subTasks);
            return task;
          });
      }

      tree.push(task);
    });

    return tree;
  }
}
