import { Injectable } from '@angular/core';
import { Producto } from '../models/productos.model';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { minToday } from '../validators/date.validator';

@Injectable({
  providedIn: 'root',
})
export class BuildFormService {

  constructor(private fb: FormBuilder) {}

  private formatDate(date: Date | string): string {
    if (!date) return '';
    const fecha = typeof date === 'string' ? new Date(date) : date;
    const day = (fecha.getDate() + 1).toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear();
    return `${year}-${month}-${day}`;
  }

  public buildForm(product: Producto): FormGroup {
    
    return this.fb.group({
      id: [product?.id ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: [product?.name ?? '', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [product?.description ?? '', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: [product?.logo ?? '', [Validators.required]],
      date_release: [this.formatDate(product.date_release), [Validators.required, minToday]],
      date_revision: [this.formatDate(product.date_revision), [Validators.required]],
    });
  }

}
