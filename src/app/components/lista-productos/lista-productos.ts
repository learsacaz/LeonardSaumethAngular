import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { Producto } from '../../models/productos.model';
import { DateFormatPipe } from '../../pipes/date-format-pipe';

@Component({
  standalone: true,
  selector: 'app-lista-productos',
  imports: [DateFormatPipe],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
})
export class ListaProductos implements OnInit {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
  public productos:Producto[]=[];
  public filteredProducts: Producto[] = [];
  public cantidadProductos:number=0;
  pagedProducts: Producto[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;
  openIndex: number | null = null;
  nombreProducto: string = '';
  idProducto: string = '';
  searchText: string = '';

  constructor(public datosProductos:ProductosService, private router:Router) {}

  ngOnInit(): void {
    this.datosProductos.getProducts("products").subscribe((data)=>{
      this.productos=data.data;
      this.cantidadProductos=this.productos.length;
      this.calculatePagination();
    });
  }

  search(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
    if(input.value === '') {
     this.ngOnInit();
      return;
    }
    this.searchText = input.value.toLowerCase();

    this.filteredProducts = this.productos.filter(product =>
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

  onToggle(index: number, event: Event) {
    const current = event.target as HTMLDetailsElement;

    if (!current.open) return;

    const all = document.querySelectorAll<HTMLDetailsElement>('details.dropdown');

    all.forEach((details, i) => {
      if (i !== index) {
        details.removeAttribute('open');
      }
    });
  }

  open(productName:Producto) {
    const dialog = this.dialog.nativeElement;
    dialog.showModal();
    this.nombreProducto = productName.name;
    this.idProducto = productName.id;
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  }

  close() {
    this.dialog.nativeElement.close();
  }

  confirmDelete(){
    this.datosProductos.deleteProducts("products/"+this.idProducto).subscribe((data)=>{
      console.log(data);
      this.ngOnInit()
      this.close();
    });
  }

}
