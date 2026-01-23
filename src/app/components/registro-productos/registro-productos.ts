import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DateOneYearLaterPipe } from '../../pipes/date-one-year-later-pipe';
import { Notification } from '../../layouts/notification/notification';
import { BuildFormService } from '../../services/build-form.service';
import { Producto } from '../../models/productos.model';
 import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-registro-productos',
  imports: [ReactiveFormsModule, CommonModule, Notification],
  templateUrl: './registro-productos.html',
  styleUrl: './registro-productos.css',
})
export class RegistroProductos implements OnInit {

  public productForm!:FormGroup;
  public today!: string;
  private dateOneYearLater = new DateOneYearLaterPipe();
  statusMessage!: string;
  message: string = '';
  notification: boolean = false;

  constructor(public productosService:ProductosService, private router:Router, private formService: BuildFormService) {}

  ngOnInit(): void {

    const todayDate = new Date();
    todayDate.setHours(todayDate.getHours() - 5);
    this.today = todayDate.toISOString().split('T')[0];

    this.productForm = this.formService.buildForm({} as Producto);

    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      
      const newDate = this.dateOneYearLater.transform(value);
      this.productForm.get('date_revision')?.setValue(newDate);
      
    });

  }

  restart(){
    this.productForm.reset();
  }

  registrarProducto() {
    try {
      if (this.productForm.invalid) {
        this.productForm.markAllAsTouched();
        return;
      }

      this.productosService.getProduct(`products/verification/${this.productForm.value.id}`)
        .pipe(
          catchError(error => {
            this.statusMessage = "errorServer";
            this.message = 'Hubo un error al verificar el ID del producto. Inténtalo más tarde.';
            this.notification = true;
            setTimeout(() => this.notification = false, 5000);
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (data) => {
            if (data) {
              this.statusMessage = "errorIdExists";
              this.message = 'El ID del producto ya existe. Por favor, elija otro ID.';
              this.notification = true;
              setTimeout(() => this.notification = false, 5000);
            } else {
              this.productosService.postProducts("products", JSON.stringify(this.productForm.value))
                .pipe(
                  catchError(error => {
                    this.statusMessage = "errorRegister";
                    this.message = 'Hubo un error al registrar el producto. Inténtalo más tarde.';
                    this.notification = true;
                    setTimeout(() => this.notification = false, 5000);
                    return throwError(() => error);
                  })
                )
                .subscribe({
                  next: () => {
                    this.statusMessage = "success";
                    this.message = 'Producto registrado exitosamente.';
                    this.notification = true;
                    setTimeout(() => {
                      this.notification = false;
                      this.router.navigate(['/lista-productos']);
                    }, 3000);
                  }
                });
            }
          }
        });
    } catch (error) {
      this.statusMessage = "errorUnexpected";
      this.message = 'Ocurrió un error inesperado. Inténtalo más tarde.';
      this.notification = true;
      setTimeout(() => this.notification = false, 5000);
    }
  }


}
