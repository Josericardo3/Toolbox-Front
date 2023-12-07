import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalDiagnosticoService } from 'src/app/servicios/modalDiagnostico/modal-diagnostico.service';

@Component({
  selector: 'app-modal-diagnostico',
  templateUrl: './modal-diagnostico.component.html',
  styleUrls: ['./modal-diagnostico.component.css']
})
export class ModalDiagnosticoComponent implements OnInit{

  private modalRef: NgbModalRef | null = null;

  constructor(
    private modalService: NgbModal, 
    private modal: ModalDiagnosticoService
  ) {}

  ngOnInit() {
    this.modal.confirmacion$
    .subscribe((confirmacion) => {
      if (confirmacion) {
        this.mostrarModal();
      } else {
        this.cerrarModal();
      }
    });
  }

  mostrarModal() {
    this.modalRef = this.modalService.open(ModalDiagnosticoComponent, { centered: true });
  }

  cerrarModal() {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

  regresarAlCuestionario(){

  }

  cancelar(){
    
  }
}
