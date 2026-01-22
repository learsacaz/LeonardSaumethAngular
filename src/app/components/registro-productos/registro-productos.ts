import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { minToday } from '../../validators/date.validator';
import { DateOneYearLaterPipe } from '../../pipes/date-one-year-later-pipe';
import { Notification } from '../../layouts/notification/notification';

@Component({
  standalone: true,
  selector: 'app-registro-productos',
  imports: [ReactiveFormsModule, CommonModule, Notification],
  templateUrl: './registro-productos.html',
  styleUrl: './registro-productos.css',
})
export class RegistroProductos implements OnInit {

  public formCreateProduct!:FormGroup;
  public today!: string;
  private dateOneYearLater = new DateOneYearLaterPipe();
  statusMessage!: string;
  message: string = '';
  notification: boolean = false;

  constructor(public datosProductos:ProductosService, private router:Router, private fb: FormBuilder) {}

  ngOnInit(): void {

    const todayDate = new Date();
    todayDate.setHours(todayDate.getHours() - 5);
    this.today = todayDate.toISOString().split('T')[0];

    this.formCreateProduct = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, minToday]],
      date_revision: ['', [Validators.required]],
    });

    this.formCreateProduct.get('date_release')?.valueChanges.subscribe(value => {
      
      const newDate = this.dateOneYearLater.transform(value);
      this.formCreateProduct.get('date_revision')?.setValue(newDate);
      
    });

  }

  restart(){
    this.formCreateProduct.reset();
  }

  registrarProducto(){

    if (this.formCreateProduct.invalid) {
      this.formCreateProduct.markAllAsTouched();
      return;
    }
    console.log(JSON.stringify(this.formCreateProduct.value));
    
    this.datosProductos.getProduct(`products/verification/${this.formCreateProduct.value.id}`).subscribe({
      next: (data) => {
        if(data){
          this.statusMessage = "errorIdExists";
          this.message = 'El ID del producto ya existe. Por favor, elija otro ID.';
          this.notification = true;
          setTimeout(() => {
            this.notification = false;
          }, 5000);
        }else{
          this.datosProductos.postProducts("products", JSON.stringify(this.formCreateProduct.value)).subscribe({
            next: (data) => {
              this.statusMessage = "success";
              this.message = 'Producto registrado exitosamente.';
              this.notification = true;
              setTimeout(() => {
                this.notification = false;
                this.router.navigate(['/lista-productos']);
              }, 3000);
            },
            error: (error) => {
              this.statusMessage = "errorRegister";
              this.message = 'Hubo un error al registrar el producto. Inténtalo más tarde.';
              this.notification = true;
              setTimeout(() => {
                this.notification = false;
              }, 5000);
            }
          });
        }
      },
      error: (error) => {
        this.statusMessage = "errorServer";
        this.message = 'Hubo un error al verificar el ID del producto. Inténtalo más tarde.';
        this.notification = true;
        setTimeout(() => {
          this.notification = false;
        }, 5000);
      }
    });


  }

}
