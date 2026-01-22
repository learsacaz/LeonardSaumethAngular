import { TestBed } from '@angular/core/testing';
import { ProductoStateService } from './producto-state.service';

describe('ProductoStateService', () => {
  let service: ProductoStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
