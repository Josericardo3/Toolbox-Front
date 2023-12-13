import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BtnEmpezarContinuarService {

  constructor() { }

  private totalFormulariosSumSource = new BehaviorSubject<number>(0);
  totalFormulariosSum$ = this.totalFormulariosSumSource.asObservable();

  private totalFormulariosRespondidosSource  = new BehaviorSubject<number>(0);
  totalFormulariosRespondidos$ = this.totalFormulariosRespondidosSource.asObservable();

  updateTotalFormulariosSum(sum: number) {
    this.totalFormulariosSumSource.next(sum);
  }

  updateTotalFormulariosRespondidos(total: number) {
    this.totalFormulariosRespondidosSource.next(total);
  }

  // private guardadoSubject = new BehaviorSubject<{ [key: string]: boolean }>({});
  // guardado$ = this.guardadoSubject.asObservable();

  // private progresoSubject = new BehaviorSubject<{ [key: string]: number }>({});
  // progreso$ = this.progresoSubject.asObservable();

  // actualizarGuardado(id: string, valor: boolean) {
  //   const nuevosValores = { ...this.guardadoSubject.value, [id]: valor };
  //   this.guardadoSubject.next(nuevosValores);
  // }

  // obtenerGuardado(id: string): boolean {
  //   return this.guardadoSubject.value[id] || false;
  // }

  // actualizarProgreso(id: string, progreso: number) {
  //   const nuevosValores = { ...this.progresoSubject.value, [id]: progreso };
  //   this.progresoSubject.next(nuevosValores);
  // }

  // obtenerProgreso(id: string): number {
  //   return this.progresoSubject.value[id] || 0;
  // }  
}
