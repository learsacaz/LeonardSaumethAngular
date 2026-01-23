import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DateOneYearLaterPipe } from '../../pipes/date-one-year-later-pipe';
import { Notification } from '../../layouts/notification/notification';
import { ProductoStateService } from '../../services/producto-state.service';
import { Producto } from '../../models/productos.model';
import { BuildFormService } from '../../services/build-form.service';
import { DateFormatPipe } from '../../pipes/date-format-pipe';
import { catchError } from 'rxjs/operators'; import { throwError } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-actualizacion-producto',
  imports: [ReactiveFormsModule, CommonModule, Notification],
  templateUrl: './actualizacion-producto.html',
  styleUrl: './actualizacion-producto.css',
  providers: [DateFormatPipe]
})
export class ActualizacionProducto implements OnInit {
  public productForm!:FormGroup;
  public today!: string;
  private dateOneYearLater = new DateOneYearLaterPipe();
  statusMessage!: string;
  message: string = '';
  notification: boolean = false;
  producto!: Producto

  constructor(public productosService:ProductosService, private router:Router, private formService: BuildFormService, private productoState: ProductoStateService) {}

  ngOnInit(): void {

    const todayDate = new Date();
    todayDate.setHours(todayDate.getHours() - 5);
    this.today = todayDate.toISOString().split('T')[0];

    this.producto = this.productoState.getProducto();
    
    this.productForm = this.formService.buildForm(this.producto);

    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      const newDate = this.dateOneYearLater.transform(value);
      this.productForm.get('date_revision')?.setValue(newDate);
    });

  }

  restart(){
    this.productForm.reset();
  }

  actualizarProducto() {
    try {
      if (this.productForm.invalid) {
        this.productForm.markAllAsTouched();
        return;
      }

      this.productosService.getProduct(`products/verification/${this.productForm.value.id}`)
        .pipe(
          catchError(error => {
            this.statusMessage = "error";
            this.message = 'Hubo un error al verificar el ID del producto. Inténtalo más tarde.';
            this.notification = true;
            setTimeout(() => this.notification = false, 5000);
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (data) => {
            if (!data) {
              this.statusMessage = "error";
              this.message = 'El ID del producto no existe. Por favor, intente más tarde.';
              this.notification = true;
              setTimeout(() => this.notification = false, 5000);
            } else {
              this.productosService.putProducts(
                `products/${this.productForm.value.id}`,
                JSON.stringify(this.productForm.value)
              )
              .pipe(
                catchError(error => {
                  this.statusMessage = "error";
                  this.message = 'Hubo un error al actualizar el producto. Inténtalo de nuevo.';
                  this.notification = true;
                  setTimeout(() => this.notification = false, 5000);
                  return throwError(() => error);
                })
              )
              .subscribe({
                next: () => {
                  this.statusMessage = "success";
                  this.message = 'Producto actualizado exitosamente.';
                  this.notification = true;
                  setTimeout(() => {
                    this.notification = false;
                    this.router.navigate(['/lista-productos']);
                    this.productoState.clear();
                  }, 3000);
                }
              });
            }
          }
        });
    } catch (error) {
      // Manejo de excepciones síncronas (ej. error en JSON.stringify)
      this.statusMessage = "error";
      this.message = 'Ocurrió un error inesperado. Inténtalo más tarde.';
      this.notification = true;
      setTimeout(() => this.notification = false, 5000);
    }
  }


}
