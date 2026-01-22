import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProductos } from './lista-productos';
import { ProductosService } from '../../services/productos.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('ListaProductos', () => {
  let component: ListaProductos;
  let fixture: ComponentFixture<ListaProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProductos, HttpClientModule],
      providers: [
        ProductosService,
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { 
              paramMap: new Map(),
            }, 
          }, 
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
