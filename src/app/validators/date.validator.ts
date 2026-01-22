import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minToday(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    let inputDate: Date;

    if (typeof control.value === 'string') {
        const [year, month, day] = control.value.split('-').map(Number);
        inputDate = new Date(year, month - 1, day);
    } else if (control.value instanceof Date) {
        inputDate = control.value;
    } else {
        return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate < today ? { minToday: true } : null;
}