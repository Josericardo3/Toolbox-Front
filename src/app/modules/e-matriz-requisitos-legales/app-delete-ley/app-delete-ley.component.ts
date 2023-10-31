import { EMatrizRequisitosLegalesComponent } from '../../e-matriz-requisitos-legales/e-matriz-requisitos-legales.component';

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { AppFormularioComponent } from '../../formulario/app-formulario/app-formulario.component';
import { Console, log } from 'console';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';



@Component({
  selector: 'app-app-delete-ley',
  templateUrl: './app-delete-ley.component.html',
  styleUrls: ['./app-delete-ley.component.css']
})
export class AppDeleteLeyComponent {
  @Input() indice: number;
  @Input() objAuditoria: object;
//INPUT DE MATRIZ LEGAL
  @Input() selectedMatrizId: number;
  @Input() deleteMatriz: boolean = false;
  public message: string;

  
  @Output() valorEnviado = new EventEmitter<number>();

  constructor(
    
    public ApiService: ApiService,
    
    public EMatrizRequisitosLegalesComponent: EMatrizRequisitosLegalesComponent,
    // public AppFormularioComponent: AppFormularioComponent,
    private Message: ModalService,
  ) { }
  

  ngOnInit() {
  this.fnConsultActivities();
  }

  enviarValor() {
    const valor = -1 ;
    this.valorEnviado.emit(valor);
  }
  rolesArraytemp: any =[];
  fnConsultActivities() {
    this.ApiService.getActivities().subscribe((data) => {
      this.rolesArraytemp = data;
    })}

  confirmDelete(): void {
    if(this.deleteMatriz ==true){
      
      
      this.ApiService.deleteLey(this.selectedMatrizId).subscribe((dataLey)=>{
        console.log(this.selectedMatrizId);
          const title = "Eliminación exitosa";
          const message = "El registro se ha eliminado exitosamente"
          this.Message.showModal(title, message);
          this.EMatrizRequisitosLegalesComponent.separarCategoria();

      })     

    }else{
      if(this.indice != undefined){
        const valor = -2 ;
        this.ApiService.deleteActivities(this.indice).subscribe((data) => {
          const title = "Eliminación exitosa";
          const message = "El registro se ha eliminado exitosamente"
          this.Message.showModal(title, message);
          
            this.valorEnviado.emit(valor);
      })
      } else{
        this.objAuditoria = {}
        this.enviarValor();
      }

    }
    
   
  }
  cancelDelete(): void {
    console.log("MATRIZ A BORRAR: ", this.selectedMatrizId);
    
  }
}