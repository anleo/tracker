import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'textLimit'})
export class TextLimitPipe implements PipeTransform {
  transform(text: string, limit: number): string {
    return text.length > 10 ? text.slice(0, limit) : text;
  }
}
