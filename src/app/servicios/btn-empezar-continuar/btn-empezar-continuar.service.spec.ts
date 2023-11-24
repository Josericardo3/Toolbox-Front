import { TestBed } from '@angular/core/testing';

import { BtnEmpezarContinuarService } from './btn-empezar-continuar.service';

describe('BtnEmpezarContinuarService', () => {
  let service: BtnEmpezarContinuarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BtnEmpezarContinuarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
