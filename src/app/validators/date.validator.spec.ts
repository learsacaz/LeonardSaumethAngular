import { FormControl } from '@angular/forms';
import { minToday } from './date.validator';

describe('minToday Validator', () => {
  it('debería retornar null si el valor es null o vacío', () => {
    const control = new FormControl(null);
    expect(minToday(control)).toBeNull();

    const control2 = new FormControl('');
    expect(minToday(control2)).toBeNull();
  });

  it('debería retornar error si la fecha es anterior a hoy (string)', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const control = new FormControl(yesterday.toISOString().split('T')[0]);
    expect(minToday(control)).toEqual({ minToday: true });
  });

  it('debería retornar null si la fecha es hoy (string)', () => {
    const today = new Date();
    const control = new FormControl(today.toISOString().split('T')[0]);
    expect(minToday(control)).toBeNull();
  });

  it('debería retornar null si la fecha es futura (string)', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const control = new FormControl(tomorrow.toISOString().split('T')[0]);
    expect(minToday(control)).toBeNull();
  });

  it('debería retornar error si la fecha es anterior a hoy (Date)', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const control = new FormControl(yesterday);
    expect(minToday(control)).toEqual({ minToday: true });
  });

  it('debería retornar null si la fecha es futura (Date)', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const control = new FormControl(tomorrow);
    expect(minToday(control)).toBeNull();
  });

  it('debería retornar null si el valor no es string ni Date', () => {
    const control = new FormControl(123 as any);
    expect(minToday(control)).toBeNull();
  });
});
