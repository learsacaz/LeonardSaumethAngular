import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ActualizacionProducto } from './actualizacion-producto';
import { ProductosService } from '../../services/productos.service';
import { ProductoStateService } from '../../services/producto-state.service';
import { Notification } from '../../layouts/notification/notification';
import { Producto } from '../../models/productos.model';

describe('ActualizacionProducto', () => {
  let component: ActualizacionProducto;
  let fixture: ComponentFixture<ActualizacionProducto>;
  let mockProductosService: jest.Mocked<ProductosService>;
  let mockProductoStateService: jest.Mocked<ProductoStateService>;
  let mockRouter: jest.Mocked<Router>;

  const mockProducto: Producto = {
    id: 'trj-crd',
    name: 'Producto Test',
    description: 'Descripción del producto test',
    logo: 'logo.png',
    date_release: new Date('2026-02-15'),
    date_revision: new Date('2027-02-15')
  };

  beforeEach(async () => {
    mockProductosService = jest.mocked({
      getProduct: jest.fn(),
      putProducts: jest.fn(),
      postProducts: jest.fn(),
      deleteProducts: jest.fn(),
      getProducts: jest.fn()
    } as any) as jest.Mocked<ProductosService>;

    mockProductoStateService = jest.mocked({
      getProducto: jest.fn()
    } as any) as jest.Mocked<ProductoStateService>;

    mockRouter = jest.mocked({
      navigate: jest.fn()
    } as any) as jest.Mocked<Router>;

    mockProductoStateService.getProducto.mockReturnValue(mockProducto);

    await TestBed.configureTestingModule({
      imports: [ActualizacionProducto, ReactiveFormsModule, Notification],
      providers: [
        { provide: ProductosService, useValue: mockProductosService },
        { provide: ProductoStateService, useValue: mockProductoStateService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActualizacionProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with product data', () => {
      expect(component.formCreateProduct.get('id')?.value).toBe('trj-crd');
      expect(component.formCreateProduct.get('name')?.value).toBe('Producto Test');
      expect(component.formCreateProduct.get('description')?.value).toBe('Descripción del producto test');
      expect(component.formCreateProduct.get('logo')?.value).toBe('logo.png');
    });

    it('should set today date correctly', () => {
      expect(component.today).toBeTruthy();
      expect(component.today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('Form Validation', () => {
    it('should invalidate form with empty id', () => {
      component.formCreateProduct.get('id')?.setValue('');
      expect(component.formCreateProduct.get('id')?.hasError('required')).toBeTruthy();
    });

    it('should invalidate id with less than 3 characters', () => {
      component.formCreateProduct.get('id')?.setValue('ab');
      expect(component.formCreateProduct.get('id')?.hasError('minlength')).toBeTruthy();
    });

    it('should invalidate name with less than 5 characters', () => {
      component.formCreateProduct.get('name')?.setValue('Test');
      expect(component.formCreateProduct.get('name')?.hasError('minlength')).toBeTruthy();
    });

    it('should invalidate description with less than 10 characters', () => {
      component.formCreateProduct.get('description')?.setValue('Short');
      expect(component.formCreateProduct.get('description')?.hasError('minlength')).toBeTruthy();
    });
  });

  describe('Date Handling', () => {
    it('should update date_revision when date_release changes', (done) => {
      component.formCreateProduct.patchValue({
        date_release: '2026-03-15'
      });

      setTimeout(() => {
        const dateRevision = component.formCreateProduct.get('date_revision')?.value;
        expect(dateRevision).toBe('2027-03-15');
        done();
      }, 100);
    });
  });

  describe('actualziarProducto', () => {
    beforeEach(() => {
      component.formCreateProduct.patchValue({
        id: 'trj-crd',
        name: 'Producto Actualizado',
        description: 'Descripción actualizada del producto',
        logo: 'nuevo-logo.png',
        date_release: new Date('2026-02-15'),
        date_revision: new Date('2027-02-15')
      });
    });

    it('should mark form as touched if invalid', () => {
      component.formCreateProduct.reset();
      component.actualziarProducto();
      expect(component.formCreateProduct.touched).toBeTruthy();
    });

    it('should verify product exists before updating', () => {
      mockProductosService.getProduct.mockReturnValue(of(mockProducto));
      mockProductosService.putProducts.mockReturnValue(of('success'));

      component.actualziarProducto();

      expect(mockProductosService.getProduct).toHaveBeenCalledWith('products/verification/trj-crd');
    });

    it('should update product successfully', (done) => {
      mockProductosService.getProduct.mockReturnValue(of(mockProducto));
      mockProductosService.putProducts.mockReturnValue(of('success'));

      component.actualziarProducto();

      setTimeout(() => {
        expect(component.statusMessage).toBe("success");
        expect(component.message).toBe('Producto actualizado exitosamente.');
        expect(component.notification).toBeFalsy();
        done();
      }, 3500);
    });

    it('should handle product not found error', (done) => {
      mockProductosService.getProduct.mockReturnValue(of(null));

      component.actualziarProducto();

      setTimeout(() => {
        expect(component.statusMessage).toBe("error");
        expect(component.message).toBe('El ID del producto no existe. Por favor, intente más tarde.');
        done();
      }, 5500);
    });

    it('should handle update error', (done) => {
      mockProductosService.getProduct.mockReturnValue(of(mockProducto));
      mockProductosService.putProducts.mockReturnValue(of('success'));

      component.actualziarProducto();

      setTimeout(() => {
        expect(component.statusMessage).toBe("error");
        expect(component.message).toBe('Hubo un error al verificar el ID del producto. Inténtalo más tarde.');
        done();
      }, 5500);
    });

    it('should handle verification error', fakeAsync(() => {
      mockProductosService.getProduct.mockReturnValue(
        throwError(() => ({ status: 400 }))
      );

      component.actualziarProducto();
      tick();

      expect(component.statusMessage).toBe("error");
      expect(component.message).toBe('Hubo un error al actualizar el producto. Inténtalo de nuevo.');
    }));

    it('should navigate to lista-productos on success', (done) => {
      mockProductosService.getProduct.mockReturnValue(of(mockProducto));
      mockProductosService.putProducts.mockReturnValue(of('success'));

      component.actualziarProducto();

      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/lista-productos']);
        expect(component.statusMessage).toBe("success");
        done();
      }, 3500);
    });
  });

  describe('restart', () => {
    it('should reset form', () => {
      component.formCreateProduct.patchValue({
        id: 'TEST',
        name: 'Test'
      });

      component.restart();

      expect(component.formCreateProduct.get('id')?.value).toBeNull();
      expect(component.formCreateProduct.get('name')?.value).toBeNull();
    });
  });
});
