import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'dateOneYearLater'
})
export class DateOneYearLaterPipe implements PipeTransform {

  newDate!: string;

  transform(value: unknown): unknown {
    if (!value) return '';

    if (typeof value === 'string') {
      const [year, month, day] = (value as string).split('-').map(Number);
      const nextYear = year + 1;
      
      // Validar 29 de febrero
      let finalDay = day;
      if (month === 2 && day === 29) {
        const isLeapYear = (nextYear % 4 === 0 && nextYear % 100 !== 0) || (nextYear % 400 === 0);
        if (!isLeapYear) {
          finalDay = 28;
        }
      }
      this.newDate = `${nextYear}-${String(month).padStart(2, '0')}-${String(finalDay).padStart(2, '0')}`;
    } else if (value instanceof Date) {
        const [year, month, day] = (value as Date).toISOString().split('T')[0].split('-').map(Number);
        const nextYear = year + 1;
        
        // Validar 29 de febrero
        let finalDay = day;
        if (month === 2 && day === 29) {
          const isLeapYear = (nextYear % 4 === 0 && nextYear % 100 !== 0) || (nextYear % 400 === 0);
          if (!isLeapYear) {
            finalDay = 28;
          }
        }
        this.newDate = `${nextYear}-${String(month).padStart(2, '0')}-${String(finalDay).padStart(2, '0')}`;
    } else {
        return null;
    }

    return this.newDate;
  }

}