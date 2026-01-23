import { ActualizacionProducto } from './actualizacion-producto';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoStateService } from '../../services/producto-state.service';
import { of, throwError } from 'rxjs';
import { BuildFormService } from '../../services/build-form.service';

describe('ActualizacionProducto Component', () => {
  let component: ActualizacionProducto;
  let mockProductosService: jest.Mocked<ProductosService>;
  let mockRouter: jest.Mocked<Router>;
  let mockBuildFormService: jest.Mocked<BuildFormService>;
  let mockProductoState: jest.Mocked<ProductoStateService>;

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
      putProducts: jest.fn()
    } as any;
    mockRouter = { navigate: jest.fn() } as any;
    mockBuildFormService = { buildForm: jest.fn().mockReturnValue(fakeForm) } as any;
    mockProductoState = { getProducto: jest.fn().mockReturnValue(productoMock) } as any;

    component = new ActualizacionProducto(mockProductosService, mockRouter, mockBuildFormService, mockProductoState);
    component.ngOnInit();
  });

  it('debería inicializar el formulario con datos del producto', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.value.id).toBe('123');
    expect(component.productForm.value.name).toBe('Producto Test');
    expect(component.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('debería resetear el formulario en restart()', () => {
    component.productForm.patchValue({ name: 'Otro Producto' });
    component.restart();
    expect(component.productForm.value.name).toBeNull();
  });

  it('no debería actualizar si el formulario es inválido', () => {
    component.productForm.get('id')?.setValue('');
    component.productForm.get('name')?.setValue('');
    component.productForm.updateValueAndValidity();

    expect(component.productForm.invalid).toBe(true);

    component.actualizarProducto();

    expect(mockProductosService.getProduct).not.toHaveBeenCalled();
  });


  it('debería mostrar error si el ID no existe', () => {
    mockProductosService.getProduct.mockReturnValue(of(false));
    component.actualizarProducto();
    expect(component.statusMessage).toBe('error');
    expect(component.message).toContain('no existe');
    expect(component.notification).toBe(true);
  });

  it('debería actualizar producto exitosamente', () => {
    mockProductosService.getProduct.mockReturnValue(of(true));
    mockProductosService.putProducts.mockReturnValue(of({}));

    component.actualizarProducto();

    expect(component.statusMessage).toBe('success');
    expect(component.message).toContain('actualizado exitosamente');
    expect(component.notification).toBe(true);
  });

  it('debería manejar error en putProducts', () => {
    mockProductosService.getProduct.mockReturnValue(of(true));
    mockProductosService.putProducts.mockReturnValue(throwError(() => new Error('error')));

    component.actualizarProducto();

    expect(component.statusMessage).toBe('error');
    expect(component.message).toContain('Hubo un error al actualizar');
    expect(component.notification).toBe(true);
  });

  it('debería manejar error en getProduct', () => {
    mockProductosService.getProduct.mockReturnValue(throwError(() => new Error('error')));

    component.actualizarProducto();

    expect(component.statusMessage).toBe('error');
    expect(component.message).toContain('Hubo un error al verificar');
    expect(component.notification).toBe(true);
  });
});
