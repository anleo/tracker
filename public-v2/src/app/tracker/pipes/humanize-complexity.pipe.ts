import {Pipe, PipeTransform} from '@angular/core';
import {TaskComplexities} from "../tasks/components/complexity/task-complexities";

@Pipe({name: 'humanizeComplexity'})
export class HumanizeComplexityPipe implements PipeTransform {

  transform(value: number): string {
    TaskComplexities.forEach(function (complexity) {
      if (value == complexity.value) {
        return complexity.name;
      }
    })
  }
}
