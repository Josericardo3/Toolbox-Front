import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ModalDiagnosticoService {

  constructor() {}

  private confirmacionSubject = new BehaviorSubject<boolean>(false);

  get confirmacion$() {
    return this.confirmacionSubject.asObservable();
  }

  activarConfirmacion() {
    this.confirmacionSubject.next(true);
  }

  desactivarConfirmacion() {
    this.confirmacionSubject.next(false);
  }
}