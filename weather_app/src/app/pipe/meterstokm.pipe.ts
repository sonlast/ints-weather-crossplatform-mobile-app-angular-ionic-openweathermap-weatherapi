import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meterstokm',
  standalone: false
})
export class MeterstokmPipe implements PipeTransform {

  transform(value: number): number {
    return value / 1000;
  }

}
