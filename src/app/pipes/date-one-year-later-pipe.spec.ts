import { DateOneYearLaterPipe } from './date-one-year-later-pipe';

describe('DateOneYearLaterPipe', () => {
  let pipe: DateOneYearLaterPipe;

  beforeEach(() => {
    pipe = new DateOneYearLaterPipe();
  });

  it('debería retornar "" si el valor es null o undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('debería transformar un string YYYY-MM-DD al mismo día del siguiente año', () => {
    const result = pipe.transform('2025-01-22');
    expect(result).toBe('2026-01-22');
  });

  it('debería transformar un objeto Date al mismo día del siguiente año', () => {
    const date = new Date('2025-01-22');
    const result = pipe.transform(date);
    expect(result).toBe('2026-01-22');
  });

  it('debería manejar correctamente el 29 de febrero cuando el siguiente año no es bisiesto', () => {
    const result = pipe.transform('2028-02-29');
    expect(result).toBe('2029-02-28');
  });

  it('debería retornar null si el valor no es string ni Date', () => {
    expect(pipe.transform(123 as any)).toBeNull();
    expect(pipe.transform({} as any)).toBeNull();
  });
});
