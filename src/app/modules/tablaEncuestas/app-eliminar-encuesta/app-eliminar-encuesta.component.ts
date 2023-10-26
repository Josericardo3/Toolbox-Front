import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { AppTablaEncuestasComponent } from '../app-tabla-encuestas/app-tabla-encuestas.component';

@Component({
  selector: 'app-app-eliminar-encuesta',
  templateUrl: './app-eliminar-encuesta.component.html',
  styleUrls: ['./app-eliminar-encuesta.component.css']
})
export class AppEliminarEncuestaComponent implements OnInit{

  @Input() indice: number;
  @Output() valorEnviado = new EventEmitter<number>();

  public message: string;
  rolesArraytemp: any =[];
  mostrarModalEliminar = false;
  noticiaId: number;
  datos: any = [];

  constructor(
    public apiService: ApiService,
    private Message: ModalService,
    private tablaEncuesta: AppTablaEncuestasComponent,
  ) { }

  ngOnInit() { }

  enviarValor() {
    const valor = -1 ;
    this.valorEnviado.emit(valor);
  }

  confirmDelete(){
    if(this.indice != undefined){
      const valor = -2 ;
      this.apiService.deleteEncuesta(this.indice)
      .subscribe(data => {
        const title = "Eliminación exitosa";
        const message = "El registro se ha eliminado exitosamente"
        this.Message.showModal(title, message);
        this.tablaEncuesta.fnListEncuestas();
        this.valorEnviado.emit(valor);
      });
    } else{
      this.enviarValor();
    }
  }

}
