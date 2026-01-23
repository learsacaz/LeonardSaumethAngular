import { RegistroProductos } from './registro-productos';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { BuildFormService } from '../../services/build-form.service';

describe('RegistroProductos Component', () => {
  let component: RegistroProductos;
  let mockProductosService: jest.Mocked<ProductosService>;
  let mockRouter: jest.Mocked<Router>;
  let mockBuildFormService: jest.Mocked<BuildFormService>;

  const productoMock = {
    id: '123',
    name: 'Producto Test',
    description: 'Descripción válida',
    logo: 'logo.png',
    date_release: '2026-01-22',
    date_revision: '2027-01-22'
  };

  beforeEach(() => {

    const fb = new FormBuilder(); 
    const fakeForm: FormGroup = fb.group(
      { id: [productoMock.id,[Validators.required, Validators.minLength(3)]], 
        name: [productoMock.name,[Validators.required]], 
        description: [productoMock.description], 
        logo: [productoMock.logo], 
        date_release: [productoMock.date_release], 
        date_revision: [productoMock.date_revision] 
      }
    );

    mockProductosService = {
      getProduct: jest.fn(),
      postProducts: jest.fn()
    } as any;

    mockRouter = { navigate: jest.fn() } as any;
    mockBuildFormService = { buildForm: jest.fn().mockReturnValue(fakeForm) } as any;

    component = new RegistroProductos(mockProductosService, mockRouter, mockBuildFormService);
    component.ngOnInit();
  });

  it('debería inicializar el formulario en ngOnInit', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('id')).toBeTruthy();
    expect(component.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('debería resetear el formulario en restart()', () => {
    component.productForm.patchValue({ id: '123', name: 'Producto Test' });
    component.restart();
    expect(component.productForm.value.id).toBeNull();
    expect(component.productForm.value.name).toBeNull();
  });

  it('no debería registrar si el formulario es inválido', () => {
    component.productForm.patchValue({ id: '' });
    component.registrarProducto();
    expect(mockProductosService.getProduct).not.toHaveBeenCalled();
  });

  it('debería mostrar error si el ID ya existe', () => {
    component.productForm.patchValue({
      id: 'ABC',
      name: 'Producto Test',
      description: 'Descripción válida',
      logo: 'logo.png',
      date_release: '2026-01-22',
      date_revision: '2027-01-22'
    });

    mockProductosService.getProduct.mockReturnValue(of(true));

    component.registrarProducto();

    expect(component.statusMessage).toBe('errorIdExists');
    expect(component.notification).toBe(true);
  });

  it('debería registrar producto exitosamente', () => {
    component.productForm.patchValue({
      id: 'XYZ',
      name: 'Producto Nuevo',
      description: 'Descripción válida',
      logo: 'logo.png',
      date_release: '2026-01-22',
      date_revision: '2027-01-22'
    });

    mockProductosService.getProduct.mockReturnValue(of(false));
    mockProductosService.postProducts.mockReturnValue(of({}));

    component.registrarProducto();

    expect(component.statusMessage).toBe('success');
    expect(component.notification).toBe(true);
  });

  it('debería manejar error en postProducts', () => {
    component.productForm.patchValue({
      id: 'XYZ',
      name: 'Producto Nuevo',
      description: 'Descripción válida',
      logo: 'logo.png',
      date_release: '2026-01-22',
      date_revision: '2027-01-22'
    });

    mockProductosService.getProduct.mockReturnValue(of(false));
    mockProductosService.postProducts.mockReturnValue(throwError(() => new Error('error')));

    component.registrarProducto();

    expect(component.statusMessage).toBe('errorRegister');
    expect(component.notification).toBe(true);
  });

  it('debería manejar error en getProduct', () => {
    component.productForm.patchValue({
      id: 'XYZ',
      name: 'Producto Nuevo',
      description: 'Descripción válida',
      logo: 'logo.png',
      date_release: '2026-01-22',
      date_revision: '2027-01-22'
    });

    mockProductosService.getProduct.mockReturnValue(throwError(() => new Error('error')));

    component.registrarProducto();

    expect(component.statusMessage).toBe('errorServer');
    expect(component.notification).toBe(true);
  });
});
