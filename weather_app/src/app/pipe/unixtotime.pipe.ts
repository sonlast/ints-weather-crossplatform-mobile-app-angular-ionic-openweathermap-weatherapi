import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixtotime',
  standalone: false
})
export class UnixtotimePipe implements PipeTransform {

  transform(unixTimestamp: number): string {
    // const timezoneOffsetInSeconds = 28800;
    
    const dateInMilliseconds = unixTimestamp * 1000;

    const date = new Date(dateInMilliseconds);

    const timeString = date.toLocaleTimeString('en-US', { timeZone: "Asia/Manila", hour12: false, hour: '2-digit', minute: '2-digit' });
  
    return timeString;
  }
}
