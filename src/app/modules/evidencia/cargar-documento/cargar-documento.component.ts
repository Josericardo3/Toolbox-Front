import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentoRequerimientoService } from '../../../servicios/documentoRequerimiento/documento-requerimiento.service';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';

@Component({
  selector: 'app-cargar-documento',
  templateUrl: './cargar-documento.component.html',
  styleUrls: ['./cargar-documento.component.css']
})
export class CargarDocumentoComponent {
  model:any;
  nombreRequerimiento;
  modeloArchivo:any={};
  respuesta:any={};
  documentos:any=[];
constructor( private _dialog: MatDialogRef<CargarDocumentoComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, private documentoRequerimientoService:DocumentoRequerimientoService,private modalService:ModalService){
    this.model=data[0];
   this.nombreRequerimiento=data[0].Nombre;
  }
  ngOnInit(){
    this.modeloArchivo.RNT=localStorage.getItem('rnt');
    this.modeloArchivo.NOMBRE_REQUERIMIENTO=this.nombreRequerimiento;
    this.documentoRequerimientoService.obtenerDocumentos(this.modeloArchivo).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
         this.documentos=x.Data;
        } else {
          
        }
      },
      error: (e) => {
        const title = 'Falló.';

        this.modalService.showModal(title, 'Algo salió mal');
      },
    });
  
  }
  cerrarDialog(opcion){
    this._dialog.close(opcion);
  }
  cargarDocumento(event){
    var modeloEnvio:any={};

    var adjunto:any;
    var fileList:FileList=event.target.files;
    var file :File=fileList[0];

    if (file) {
      console.log("Pasas");
    
      const myReader = new FileReader();
    
      myReader.onloadend = (e) => {
        console.log("Entra en onloadend");
        adjunto = myReader.result;
    
        try {
          modeloEnvio.NOMBRE_REQUERIMIENTO = this.nombreRequerimiento;
          modeloEnvio.RNT = localStorage.getItem('rnt');
          modeloEnvio.ADJUNTO = adjunto;
          modeloEnvio.NOMBRE_DOCUMENTO = file.name;
          modeloEnvio.TIPO_AJUNTO  = "." + file.name.split('.').pop();
          modeloEnvio.TIPO_DOCUMENTO  = "." + file.name.split('.').pop();
        } catch (e) {
          modeloEnvio={}
          return;
        }
      }
    
      myReader.readAsDataURL(file); // Inicia la lectura del archivo
    }
    
    this.model=modeloEnvio;
    console.log(this.model)
   
  }
  registrar() {
   

    this.documentoRequerimientoService.registrar(this.model).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.respuesta.opcion = 1;
          this.respuesta.tipo = true;
          this.respuesta.title = 'Registro exitoso.';
          this.respuesta.mensaje = x.Mensaje;
          this.cerrarDialog(this.respuesta);
        } else {
          const title = 'Falló.';

          this.modalService.showModal(title, x.Mensaje);
        }
      },
      error: (e) => {
        const title = 'Falló.';

        this.modalService.showModal(title, 'Algo salió mal');
      },
    });
  }
}
