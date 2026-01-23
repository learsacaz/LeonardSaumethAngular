import { ProductosService } from './productos.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ProductosService', () => {
  let service: ProductosService;
  let httpClientMock: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as any;

    service = new ProductosService(httpClientMock);
  });

  it('debería llamar a getProduct con la URL correcta', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getProduct('products/123').subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:3002/bp/products/123',
      expect.any(Object)
    );
  });

  it('debería llamar a getProducts con la URL correcta', () => {
    httpClientMock.get.mockReturnValue(of({}));
    service.getProducts('products').subscribe();
    expect(httpClientMock.get).toHaveBeenCalledWith(
      'http://localhost:3002/bp/products',
      expect.any(Object)
    );
  });

  it('debería llamar a postProducts con la URL y body correctos', () => {
    const body = { name: 'Nuevo Producto' };
    httpClientMock.post.mockReturnValue(of({}));
    service.postProducts('products', body).subscribe();
    expect(httpClientMock.post).toHaveBeenCalledWith(
      'http://localhost:3002/bp/products',
      body,
      expect.any(Object)
    );
  });

  it('debería llamar a putProducts con la URL y body correctos', () => {
    const body = { name: 'Producto Actualizado' };
    httpClientMock.put.mockReturnValue(of({}));
    service.putProducts('products/123', body).subscribe();
    expect(httpClientMock.put).toHaveBeenCalledWith(
      'http://localhost:3002/bp/products/123',
      body,
      expect.any(Object)
    );
  });

  it('debería llamar a deleteProducts con la URL correcta', () => {
    httpClientMock.delete.mockReturnValue(of({}));
    service.deleteProducts('products/123').subscribe();
    expect(httpClientMock.delete).toHaveBeenCalledWith(
      'http://localhost:3002/bp/products/123',
      expect.any(Object)
    );
  });
});
