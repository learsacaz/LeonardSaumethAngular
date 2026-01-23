import { DateFormatPipe } from './date-format-pipe';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe();
  });

  it('debería retornar "" si el valor es null o undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('debería transformar un string YYYY-MM-DD a DD/MM/YYYY', () => {
    const result = pipe.transform('2025-01-22');
    expect(result).toBe('22/01/2025');
  });

  it('debería transformar un objeto Date a DD/MM/YYYY', () => {
    const date = new Date('2025-12-05');
    const result = pipe.transform(date);
    
    expect(result).toBe('05/12/2025');
  });

  it('debería manejar correctamente días y meses con un solo dígito', () => {
    const result = pipe.transform('2025-03-07');
    expect(result).toBe('07/03/2025');
  });

  it('debería actualizar la propiedad oldDate internamente', () => {
    pipe.transform('2025-01-22');
    expect(pipe.oldDate instanceof Date).toBe(true);
    expect(pipe.oldDate.getFullYear()).toBe(2025);
  });
});
