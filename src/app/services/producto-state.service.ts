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
    if (!data) return {} as Producto;
    const decoded = JSON.parse(data); 
    return { ...decoded, 
      date_release: new Date(decoded.date_release), 
      date_revision: new Date(decoded.date_revision) 
    };
  }

  clear() {
    localStorage.removeItem(this.key);
  }
  
}
