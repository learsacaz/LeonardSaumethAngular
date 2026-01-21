import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-productos',
  imports: [],
  templateUrl: './registro-productos.html',
  styleUrl: './registro-productos.css',
})
export class RegistroProductos implements OnInit {

  constructor(public datosProductos:ProductosService, private router:Router) {}

  ngOnInit(): void {
    
  }

}
