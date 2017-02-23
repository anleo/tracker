import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({name: 'humanizeTime'})
export class HumanizeTimePipe implements PipeTransform {
  transform(number: number): string {
    let momentDuration = moment.duration(number * 60, 'm');
    let humanizeTime = moment.utc(momentDuration.asMilliseconds()).format('HH:mm');

    if (momentDuration.get('years')) {
      let years = momentDuration.get('years') > 1 ? ' years ' : ' year';
      humanizeTime = ' ' + momentDuration.get('years') + years + ' ' + humanizeTime;
    }

    if (momentDuration.get('days')) {
      let days = momentDuration.get('days') > 1 ? ' days ' : ' day ';
      humanizeTime = ' ' + momentDuration.get('days') + days + ' ' + humanizeTime;
    }

    return humanizeTime;
  }
}
