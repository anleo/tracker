import {Pipe, PipeTransform} from '@angular/core';

import * as _ from "lodash";

@Pipe({name: 'sortByFields'})

export class SortByFieldsPipe implements PipeTransform {
  sortOrders: Array<string> = ['asc', 'desc', 'off'];
  defaultSortingParams = {
    fields: [],
    orders: []
  };

  private offCount: number = 0;
  private sortingParams;

  transform(items: any[], sortParams): any {
    this.resetParams();

    this.offCount = _.values(sortParams).filter((order) => {
      return order === 'off'
    }).length;

    _.forEach(sortParams, (order, field) => {
      if (!this.sortOrderExist(order)) {
        console.warn('Sort Type ' + order + ' doesn\'t supported');
      }

      if (order && order !== 'off') {
        this.sortingParams.fields.push(field);
        this.sortingParams.orders.push(order);
      }
    });

    if (this.offCount !== _.values(sortParams).length) {
      return this.sortByOrder(items, this.sortingParams);
    } else {
      return this.sortByOrder(items, this.defaultSortingParams)
    }
  }

  resetParams() {
    this.sortingParams = {
      fields: [],
      orders: []
    }
  }

  sortByOrder(boards, params) {
    return _.orderBy(boards, params.fields, params.orders);
  }

  sortOrderExist(type): boolean {
    return this.sortOrders.indexOf(type) >= 0;
  }
}
