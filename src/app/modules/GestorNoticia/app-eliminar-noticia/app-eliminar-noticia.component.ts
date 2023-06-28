import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { AppGestorNoticiaComponent } from '../app-gestor-noticia/app-gestor-noticia.component';

@Component({
  selector: 'app-app-eliminar-noticia',
  templateUrl: './app-eliminar-noticia.component.html',
  styleUrls: ['./app-eliminar-noticia.component.css']
})
export class AppEliminarNoticiaComponent implements OnInit{
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
    private gestorNoticiaComponent: AppGestorNoticiaComponent,
  ) { }

  ngOnInit() { 
    this.getTableData()
    console.log(this.indice)
  }

  getTableData(){
    this.apiService.getTablaNoticias()
    .subscribe(data => {
      this.datos = data;
    })
  }

  enviarValor() {
    const valor = -1 ;
    this.valorEnviado.emit(valor);
  }

  confirmDelete(){
    if(this.indice != undefined){
      const valor = -2 ;
      this.apiService.deleteNoticia(this.indice)
      .subscribe(data => {
        console.log('se eliminó', data)
        const title = "Eliminación exitosa";
        const message = "El registro se ha eliminado exitosamente"
        this.Message.showModal(title, message);
        this.gestorNoticiaComponent.getTableData();
        this.valorEnviado.emit(valor);
      });
    } else{
      this.enviarValor();
    }
  }

}
