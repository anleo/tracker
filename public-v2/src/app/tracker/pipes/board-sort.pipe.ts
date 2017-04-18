import {Pipe, PipeTransform} from '@angular/core';
import {TaskBoard} from "../models/task-board";

import * as _ from "lodash";

@Pipe({name: 'boardSort'})

export class BoardSortPipe implements PipeTransform {
  private sortOrders: Array<string> = ['asc', 'desc', 'off'];
  private defaultSortingParams = {
    fields: ['item.priority', 'item.updatedAt'], // use item.$field due to internal structure of boardItem
    orders: ['desc', 'asc']
  };

  private offCount: number = 0;
  private sortingParams;

  transform(boards: TaskBoard[], sortParams): any {
    this.resetParams();

    this.offCount = _.values(sortParams).filter((order) => {
      return order === 'off'
    }).length;

    _.forEach(sortParams, (order, field) => {
      if (!this.sortOrderExist(order)) {
        console.warn('Sort Type ' + order + ' doesn\'t supported');
      }

      if (order && order !== 'off') {
        this.sortingParams.fields.push('item.' + field);
        this.sortingParams.orders.push(order);
      }
    });

    if (this.offCount !== _.values(sortParams).length) {
      return this.sortByOrder(boards, this.sortingParams);
    } else {
      return this.sortByOrder(boards, this.defaultSortingParams)
    }
  }

  private resetParams() {
    this.sortingParams = {
      fields: [],
      orders: []
    }
  }

  private sortByOrder(boards, params) {
    return _.orderBy(boards, params.fields, params.orders);
  }

  private sortOrderExist(type): boolean {
    return this.sortOrders.indexOf(type) >= 0;
  }
}
