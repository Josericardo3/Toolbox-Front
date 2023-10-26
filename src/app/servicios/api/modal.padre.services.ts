import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

 

@Injectable({
  providedIn: 'root'
})
export class ModalPadreService {
  // Utilizamos un Subject para notificar a los componentes cuando se debe abrir el modal
  private abrirModalSubject = new Subject<void>();

 

  abrirModal$ = this.abrirModalSubject.asObservable();

 

  abrirModal() {
    this.abrirModalSubject.next();
  }
}