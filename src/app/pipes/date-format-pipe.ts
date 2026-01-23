import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  oldDate:Date = new Date('2000-01-01');

  transform(value: unknown): unknown {
    if (!value) return '';
    
    this.oldDate = new Date(value as string);
    const day = (this.oldDate.getDate() + 1).toString().padStart(2, '0');
    const month = (this.oldDate.getMonth() + 1).toString().padStart(2, '0');
    const year = this.oldDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

}
