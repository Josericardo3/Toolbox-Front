import { TestBed } from '@angular/core/testing';

import { ModalDiagnosticoService } from './modal-diagnostico.service';

describe('ModalDiagnosticoService', () => {
  let service: ModalDiagnosticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalDiagnosticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
