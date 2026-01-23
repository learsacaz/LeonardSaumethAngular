import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ProductosService } from '../../services/productos.service';
import { ProductoStateService } from '../../services/producto-state.service';
import { Router, RouterLink } from '@angular/router';
import { Producto } from '../../models/productos.model';
import { DateFormatPipe } from '../../pipes/date-format-pipe';
import { OverlayModule } from '@angular/cdk/overlay';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-lista-productos',
  imports: [DateFormatPipe, RouterLink, OverlayModule, CommonModule],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
})
export class ListaProductos implements OnInit {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
  public productos:Producto[]=[];
  public originalProducts: Producto[] = [];
  public filteredProducts: Producto[] = [];
  public cantidadProductos:number=0;
  pagedProducts: Producto[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  isOpen: boolean = false;
  currentPage = 1;
  totalPages = 0;
  openIndex: number | null = null;
  nombreProducto: string = '';
  idProducto: string = '';
  searchText: string = '';
  currentTrigger: any;
  productSelected!: Producto;

  constructor(public datosProductos:ProductosService, private router:Router, private productoState: ProductoStateService) {}



  ngOnInit(): void {
    this.datosProductos.getProducts("products")
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (data) => {
          try {
            // Manejo de excepción lógica: datos inesperados
            if (!data || !data.data) {
              throw new Error("Formato de datos inválido");
            }

            this.originalProducts = data.data;
            this.productos = [...this.originalProducts];
            this.cantidadProductos = this.productos.length;
            this.calculatePagination();
          } catch (error) {
            throwError(() => error);
          }
        }
      });
  }


  search(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.value === '') {
      this.productos = [...this.originalProducts];
      this.calculatePagination();
      return;
    }
    this.searchText = input.value.toLowerCase();

    this.filteredProducts = this.originalProducts.filter(product =>
      product.name.toLowerCase().includes(this.searchText) ||
      product.description.toLowerCase().includes(this.searchText)
    );
    this.productos = this.filteredProducts;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.productos.length / this.pageSize);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedProducts = this.productos.slice(start, end);
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // reset página
    this.calculatePagination();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.calculatePagination();
  }

  toggleDropdown(producto: Producto, trigger: any) {
    this.currentTrigger = trigger;
    this.productSelected = producto;
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  openDelete() {
    const dialog = this.dialog.nativeElement;
    dialog.showModal();
    this.nombreProducto = this.productSelected.name;
    this.idProducto = this.productSelected.id;
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  }

  openEdit() {
    this.productoState.setProducto(this.productSelected);
    this.router.navigate(['/Actualizar-producto']);
  }

  close() {
    this.dialog.nativeElement.close();
    this.isOpen = false;
  }

  confirmDelete(){
    this.datosProductos.deleteProducts("products/"+this.idProducto).subscribe((data)=>{
      this.ngOnInit()
      this.close();
      this.isOpen = false;
    });
  }

}
