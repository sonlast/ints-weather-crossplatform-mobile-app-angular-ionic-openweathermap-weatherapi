import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'windspeedmeasurement',
  standalone: false
})
export class WindspeedmeasurementPipe implements PipeTransform {

  transform(value: number): number {
    return value * 3.6;
  }

}
