import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { minToday } from '../../validators/date.validator';
import { DateOneYearLaterPipe } from '../../pipes/date-one-year-later-pipe';
import { Notification } from '../../layouts/notification/notification';
import { ProductoStateService } from '../../services/producto-state.service';
import { Producto } from '../../models/productos.model';

@Component({
  standalone: true,
  selector: 'app-actualizacion-producto',
  imports: [ReactiveFormsModule, CommonModule, Notification],
  templateUrl: './actualizacion-producto.html',
  styleUrl: './actualizacion-producto.css',
})
export class ActualizacionProducto implements OnInit {
  public formCreateProduct!:FormGroup;
  public today!: string;
  private dateOneYearLater = new DateOneYearLaterPipe();
  statusMessage!: string;
  message: string = '';
  notification: boolean = false;
  producto!: Producto

  constructor(public datosProductos:ProductosService, private router:Router, private fb: FormBuilder, private productoState: ProductoStateService) {}

  ngOnInit(): void {

    const todayDate = new Date();
    todayDate.setHours(todayDate.getHours() - 5);
    this.today = todayDate.toISOString().split('T')[0];

    this.producto = this.productoState.getProducto();
    

    this.formCreateProduct = this.fb.group({
      id: [this.producto.id, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: [this.producto.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [this.producto.description, [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: [this.producto.logo, [Validators.required]],
      date_release: [this.producto.date_release, [Validators.required, minToday]],
      date_revision: [this.producto.date_revision, [Validators.required]],
    });

    this.formCreateProduct.get('date_release')?.valueChanges.subscribe(value => {
      
      const newDate = this.dateOneYearLater.transform(value);
      this.formCreateProduct.get('date_revision')?.setValue(newDate);
      
    });

  }

  restart(){
    this.formCreateProduct.reset();
  }

  actualziarProducto(){

    if (this.formCreateProduct.invalid) {
      this.formCreateProduct.markAllAsTouched();
      return;
    }
    
    this.datosProductos.getProduct(`products/verification/${this.formCreateProduct.value.id}`).subscribe({
      next: (data) => {
        if(!data){
          this.statusMessage = "error";
          this.message = 'El ID del producto no existe. Por favor, intente más tarde.';
          this.notification = true;
          setTimeout(() => {
            this.notification = false;
          }, 5000);
        }else{
          this.datosProductos.putProducts(`products/${this.formCreateProduct.value.id}`, JSON.stringify(this.formCreateProduct.value)).subscribe({
            next: (data) => {
              this.statusMessage = "success";
              this.message = 'Producto actualizado exitosamente.';
              this.notification = true;
              setTimeout(() => {
                this.notification = false;
                this.router.navigate(['/lista-productos']);
              }, 3000);
            },
            error: (error) => {
              this.statusMessage = "error";
              this.message = 'Hubo un error al actualizar el producto. Inténtalo de nuevo.';
              this.notification = true;
              setTimeout(() => {
                this.notification = false;
              }, 5000);
            }
          });
        }
      },
      error: (error) => {
        this.statusMessage = "error";
        this.message = 'Hubo un error al verificar el ID del producto. Inténtalo más tarde.';
        this.notification = true;
        setTimeout(() => {
          this.notification = false;
        }, 5000);
      }
    });


  }

}
