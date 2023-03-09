import { Component,OnInit,  } from '@angular/core';
import { ApiService } from '../../../servicios/api/api.service';

@Component({
  selector: 'app-app-modal-pst',
  templateUrl: './app-modal-pst.component.html',
  styleUrls: ['./app-modal-pst.component.css']
})
export class AppModalPstComponent implements OnInit {
  isOpen = true;
  opcionSeleccionado:any = '';
  verSeleccion={};
  resListAsesor: any = []

  constructor(
    public ApiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.ListarAsesor();
  }

  ListarAsesor(){
    const resAsesor = JSON.parse(localStorage.getItem('listaAsesor'));
    this.resListAsesor = resAsesor;
    //console.log(resAsesor,"datalista")
  }

  capturarValueSelect(evnt:any){
   //valor seleccionado
   this.verSeleccion = this.opcionSeleccionado.nombre ;
   //console.log(this.verSeleccion,"evento")
  }

  saveAsesor(evnt: any){
    
  }
  
  closeModal() {
    this.isOpen = false;
  }
}





