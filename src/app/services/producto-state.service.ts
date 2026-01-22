import { Injectable } from '@angular/core';
import { Producto } from '../models/productos.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoStateService {
  private key = 'productos';

  setProducto(data: Producto) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  getProducto(): Producto {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) as Producto : {} as Producto;
  }

  clear() {
    localStorage.removeItem(this.key);
  }
  
}
