import {Pipe, PipeTransform} from '@angular/core';
import {Task} from "../models/task";

import * as _ from "lodash";

@Pipe({name: 'tasksSort'})

export class TasksSortPipe implements PipeTransform {
  private sortOrders: Array<string> = ['asc', 'desc', 'off'];
  private defaultSortingParams = {
    fields: ['priority', 'updatedAt'],
    orders: ['desc', 'asc']
  };

  private offCount: number = 0;
  private sortingParams;

  transform(tasks: Task[], sortParams): Task[] {
    this.resetParams();
    this.offCount = _.values(sortParams).filter((order) => order === 'off').length;

    _.forEach(sortParams, (order, field) => {
      if (!this.sortOrderExist(order)) {
        console.warn('Sort Type ' + order + 'doesn\'t supported');
      }

      if (order !== 'off') {
        this.sortingParams.fields.push(field);
        this.sortingParams.orders.push(order);
      }
    });

    if (this.offCount !== _.values(sortParams).length) {
      return this.sortByOrder(tasks, this.sortingParams);
    } else {
      return this.sortByOrder(tasks, this.defaultSortingParams)
    }

  }

  private resetParams() {
    this.sortingParams = {
      fields: [],
      orders: []
    }
  }

  private sortByOrder(tasks, params) {
    return _.orderBy(tasks, params.fields, params.orders);
  }

  private sortOrderExist(type): boolean {
    return this.sortOrders.indexOf(type) >= 0;
  }
}
