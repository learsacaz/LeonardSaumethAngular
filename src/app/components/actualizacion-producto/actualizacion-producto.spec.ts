import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizacionProducto } from './actualizacion-producto';

describe('ActualizacionProducto', () => {
  let component: ActualizacionProducto;
  let fixture: ComponentFixture<ActualizacionProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizacionProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizacionProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
