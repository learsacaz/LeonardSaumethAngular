import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroProductos } from './registro-productos';
import { ProductosService } from '../../services/productos.service';
import { HttpClientModule } from '@angular/common/http';
import { Producto } from '../../models/productos.model';
import { Notification } from '../../layouts/notification/notification';
import { ProductoStateService } from '../../services/producto-state.service';

describe('RegistroProductos', () => {
  let component: RegistroProductos;
  let fixture: ComponentFixture<RegistroProductos>;
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
      imports: [RegistroProductos, ReactiveFormsModule, Notification],
      providers: [
        { provide: ProductosService, useValue: mockProductosService },
        { provide: ProductoStateService, useValue: mockProductoStateService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  describe('registrarProducto', () => {
    beforeEach(() => {
      component.formCreateProduct.patchValue({
        id: 'trj-crd',
        name: 'Producto Actualizado',
        description: 'Descripción registrada del producto',
        logo: 'nuevo-logo.png',
        date_release: new Date('2026-02-15'),
        date_revision: new Date('2027-02-15')
      });
    });

    it('should mark form as touched if invalid', () => {
      component.formCreateProduct.reset();
      component.registrarProducto();
      expect(component.formCreateProduct.touched).toBeTruthy();
    });

    it('should verify product exists before updating', () => {
      mockProductosService.getProduct.mockReturnValue(of(mockProducto));
      mockProductosService.putProducts.mockReturnValue(of('success'));

      component.registrarProducto();

      expect(mockProductosService.getProduct).toHaveBeenCalledWith('products/verification/trj-crd');
    });

    it('should update product successfully', (done) => {
      mockProductosService.getProduct.mockReturnValue(of(mockProducto));
      mockProductosService.putProducts.mockReturnValue(of('success'));

      component.registrarProducto();

      setTimeout(() => {
        expect(component.statusMessage).toBe("success");
        expect(component.message).toBe('Producto registrado exitosamente.');
        expect(component.notification).toBeFalsy();
        done();
      }, 3500);
    });

    it('should handle product exists error', (done) => {
      mockProductosService.getProduct.mockReturnValue(of(mockProducto));
      mockProductosService.putProducts.mockReturnValue(of('errorIdExists'));

      component.registrarProducto();

      setTimeout(() => {
        expect(component.statusMessage).toBe("errorIdExists");
        expect(component.message).toBe('El ID del producto ya existe. Por favor, elija otro ID.');
        done();
      }, 5500);
    });

    it('should handle update error',  fakeAsync(() => {
      mockProductosService.getProduct.mockReturnValue(of(mockProducto));
      mockProductosService.getProduct.mockReturnValue( throwError(() => ({ status: 400 })) );

      component.registrarProducto();
      tick();

        expect(component.statusMessage).toBe("errorServer");
        expect(component.message).toBe('Hubo un error al verificar el ID del producto. Inténtalo más tarde.');
    }));

    it('should handle verification error', fakeAsync(() => {
      mockProductosService.getProduct.mockReturnValue(
        throwError(() => ({ status: 400 }))
      );

      component.registrarProducto();
      tick();

      expect(component.statusMessage).toBe("errorRegister");
      expect(component.message).toBe('Hubo un error al registrar el producto. Inténtalo más tarde.');
    }));

    it('should navigate to lista-productos on success', (done) => {
      mockProductosService.getProduct.mockReturnValue(of(mockProducto));
      mockProductosService.putProducts.mockReturnValue(of('success'));

      component.registrarProducto();

      setTimeout(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/lista-productos']);
        expect(component.statusMessage).toBe("success");
        done();
      }, 5500);
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
