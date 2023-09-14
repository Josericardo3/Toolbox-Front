import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  formularioEstado: { [idMatriz: number]: any } = {};
  constructor() {}
  guardarEstadoFormulario(idMatriz: number, estado: any) {
    this.formularioEstado[idMatriz] = estado;
  }
  obtenerEstadoFormulario(idMatriz: number) {
    return this.formularioEstado[idMatriz];
  }

}
