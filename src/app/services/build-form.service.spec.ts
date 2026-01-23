import { TestBed } from '@angular/core/testing';
import { BuildFormService } from './build-form.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Producto } from '../models/productos.model';

describe('BuildFormService', () => {
  let service: BuildFormService;

  const productoMock: Producto = {
    id: 'ABC123',
    name: 'Producto de prueba',
    description: 'Descripción válida para el producto',
    logo: 'logo.png',
    date_release: new Date('2026-01-22T00:00:00.000Z'),
    date_revision: new Date('2027-01-22T00:00:00.000Z')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [BuildFormService, FormBuilder]
    });

    service = TestBed.inject(BuildFormService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería construir un formulario con los datos del producto', () => {
    const form = service.buildForm(productoMock);

    expect(form).toBeTruthy();
    expect(form.get('id')?.value).toBe('ABC123');
    expect(form.get('name')?.value).toBe('Producto de prueba');
    expect(form.get('description')?.value).toContain('válida');
    expect(form.get('logo')?.value).toBe('logo.png');
    expect(form.get('date_release')?.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(form.get('date_revision')?.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('debería aplicar validadores correctamente', () => {
    const form = service.buildForm({} as Producto);

    form.get('id')?.setValue('');
    form.get('name')?.setValue('abc');
    form.get('description')?.setValue('corta');
    form.get('logo')?.setValue('');
    form.get('date_release')?.setValue('');
    form.get('date_revision')?.setValue('');

    expect(form.get('id')?.valid).toBeFalsy();
    expect(form.get('name')?.valid).toBeFalsy();
    expect(form.get('description')?.valid).toBeFalsy();
    expect(form.get('logo')?.valid).toBeFalsy();
    expect(form.get('date_release')?.valid).toBeFalsy();
    expect(form.get('date_revision')?.valid).toBeFalsy();
  });

  it('debería formatear fechas correctamente en formato yyyy-mm-dd', () => {
    const form = service.buildForm(productoMock);

    const release = form.get('date_release')?.value;
    const revision = form.get('date_revision')?.value;

    expect(release).toBe('2026-01-22');
    expect(revision).toBe('2027-01-22');
  });

});
