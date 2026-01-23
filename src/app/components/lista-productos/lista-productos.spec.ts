import { ListaProductos } from './lista-productos';
import { ProductosService } from '../../services/productos.service';
import { ProductoStateService } from '../../services/producto-state.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ListaProductos Component', () => {
  let component: ListaProductos;
  let mockProductosService: jest.Mocked<ProductosService>;
  let mockRouter: jest.Mocked<Router>;
  let mockProductoState: jest.Mocked<ProductoStateService>;

  const productosMock = [
    { id: '1', name: 'Producto A', description: 'Desc A', date_release: "2025-01-01", date_revision: "2025-01-01" },
    { id: '2', name: 'Producto B', description: 'Desc B', date_release: "2025-01-01", date_revision: "2025-01-01" },
    { id: '3', name: 'Producto C', description: 'Desc C', date_release: "2025-01-01", date_revision: "2025-01-01" },
  ] as any;

  beforeEach(() => {
    mockProductosService = {
      getProducts: jest.fn().mockReturnValue(of({ data: productosMock })),
      deleteProducts: jest.fn().mockReturnValue(of({}))
    } as any;

    mockRouter = { navigate: jest.fn() } as any;
    mockProductoState = { setProducto: jest.fn() } as any;

    component = new ListaProductos(mockProductosService, mockRouter, mockProductoState);
    component.ngOnInit();
  });

  it('debería cargar productos en ngOnInit', () => {
    expect(mockProductosService.getProducts).toHaveBeenCalledWith('products');
    expect(component.productos.length).toBe(3);
    expect(component.cantidadProductos).toBe(3);
    expect(component.pagedProducts.length).toBeGreaterThan(0);
  });

  it('debería filtrar productos en search()', () => {
    const event = { target: { value: 'Producto A' } } as any;
    component.search(event);
    expect(component.productos.length).toBe(1);
    expect(component.productos[0].name).toBe('Producto A');
  });

  it('debería resetear productos si el input está vacío en search()', () => {
    const event = { target: { value: '' } } as any;
    component.search(event);
    expect(component.productos.length).toBe(3);
  });

  it('debería cambiar el tamaño de página en onPageSizeChange()', () => {
    component.onPageSizeChange(10);
    expect(component.pageSize).toBe(10);
    expect(component.currentPage).toBe(1);
  });

  it('debería cambiar de página en changePage()', () => {
    component.changePage(2);
    expect(component.currentPage).toBe(1);
  });

  it('debería abrir y cerrar el dropdown en toggleDropdown()', () => {
    component.toggleDropdown(productosMock[0], {});
    expect(component.isOpen).toBe(true);
    component.closeDropdown();
    expect(component.isOpen).toBe(false);
  });

  it('debería llamar a productoState y router en openEdit()', () => {
    component.productSelected = productosMock[0];
    component.openEdit();
    expect(mockProductoState.setProducto).toHaveBeenCalledWith(productosMock[0]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/Actualizar-producto']);
  });

  it('debería eliminar producto en confirmDelete()', () => {
    component.productSelected = productosMock[0];
    component.idProducto = '1';
    component.confirmDelete();
    expect(mockProductosService.deleteProducts).toHaveBeenCalledWith('products/1');
  });
});