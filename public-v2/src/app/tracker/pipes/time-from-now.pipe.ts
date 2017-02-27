import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({name: 'fromNow'})
export class TimeFromNowPipe implements PipeTransform {
  transform(date: number): string {
    return date ? moment(moment.utc(date).toDate()).fromNow(true) : '';
  }
}
