import { ProductoStateService } from './producto-state.service';
import { Producto } from '../models/productos.model';

describe('ProductoStateService', () => {
  let service: ProductoStateService;

  const productoMock: Producto = {
    id: '123',
    name: 'Producto Test',
    description: 'Descripción válida',
    logo: 'logo.png',
    date_release: new Date('2026-01-22'),
    date_revision: new Date('2027-01-22')
  };

  beforeEach(() => {
    service = new ProductoStateService();

    // Limpiar mocks de localStorage antes de cada prueba
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'removeItem');
    localStorage.clear();
  });

  it('debería guardar un producto en localStorage con setProducto()', () => {
    service.setProducto(productoMock);
    expect(localStorage.setItem).toHaveBeenCalledWith('productos', JSON.stringify(productoMock));
  });

  it('debería obtener un producto válido con getProducto()', () => {
    localStorage.setItem('productos', JSON.stringify(productoMock));
    const result = service.getProducto();
    expect(result).toEqual(productoMock);
  });

  it('debería retornar objeto vacío si no hay producto en localStorage', () => {
    localStorage.removeItem('productos');
    const result = service.getProducto();
    expect(result).toEqual({} as Producto);
  });

  it('debería eliminar el producto con clear()', () => {
    localStorage.setItem('productos', JSON.stringify(productoMock));
    service.clear();
    expect(localStorage.removeItem).toHaveBeenCalledWith('productos');
    expect(service.getProducto()).toEqual({} as Producto);
  });
});
