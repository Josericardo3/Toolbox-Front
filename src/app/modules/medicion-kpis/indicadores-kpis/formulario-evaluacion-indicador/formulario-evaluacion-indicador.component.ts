import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { helpers } from 'src/app/modules/Helpers/helpers';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-formulario-evaluacion-indicador',
  templateUrl: './formulario-evaluacion-indicador.component.html',
  styleUrls: ['./formulario-evaluacion-indicador.component.css'],
})
export class FormularioEvaluacionIndicadorComponent {
  dataSource: any = [];
  @Input() model: any = {};
  @Input() periodos: any = [];
  @Input() variables: any = [];
  @Input() paquetes: any = [];
  @Input() procesos: any = [];
  @Input() responsables: any = [];
  @Input() fuenteDatos: any = [];
  filterFuenteDatos: any = [];
  filterResponsables: any = [];
  arrayInputResponsable: any = [];
  variablesT: any = [];
  tipoFilterCtrl: FormControl = new FormControl();
disableOptions=false;
muestraSemaforizacion:boolean=false;
  requiredFieldsValid: boolean = false;
  @Output() requiredValidityChange = new EventEmitter<boolean>();
  contenidoDivEditable: any;

  selectedElement: string = 'boton';
  constructor(private helper: helpers) {}

  ngOnInit() {
    this.filterFuenteDatos = this.fuenteDatos;
    this.filterResponsables = this.responsables;
  }

  submitForm(formObjetivo: any) {
    this.requiredFieldsValid =
      formObjetivo.form.status === 'INVALID' ? false : true;
    this.requiredValidityChange.emit(this.requiredFieldsValid);

    console.log("formularionnnn",formObjetivo)
  }
  seleccionar(event: any) {}
  addElementVariable(selectedElement, event: any) {}
  cambioProcesos(event: any) {
    this.disableOptions=false;
  
    this.arrayInputResponsable = [];
    console.log(event)
 
    if(event.value.some(x=>x==0) && event.value.length>0){
      this.disableOptions=true;
     
      this.procesos.forEach((element: any) => {
        console.log(this.procesos)
        var modeloItem: any = { ID_RESPONSABLE: element.ID_USUARIO_ASIGNADO };
        modeloItem.ID_PROCESO = element.Id;
        modeloItem.ID_USUARIO_ASIGNADO = element.ID_USUARIO_ASIGNADO;
        modeloItem.NOMBRE_PROCESO = this.procesos.filter(
          (x) => x.Id == element.Id
        )[0].Nombre;
  
        this.arrayInputResponsable.push(modeloItem);
  
        this.model.PROCESOS = this.arrayInputResponsable;
      });
      return;
    }
   
    this.model.PROCESOSR.forEach((element: any) => {
      var modeloItem: any = { ID_RESPONSABLE: element.ID_USUARIO_ASIGNADO };
      modeloItem.ID_PROCESO = element;
      modeloItem.ID_USUARIO_ASIGNADO = element.ID_USUARIO_ASIGNADO;
      modeloItem.NOMBRE_PROCESO = this.procesos.filter(
        (x) => x.Id == element
      )[0].Nombre;

      this.arrayInputResponsable.push(modeloItem);

      this.model.PROCESOS = this.arrayInputResponsable;
    });
  }

  onSearchInputChange(opcion: number, event: any) {
    switch (opcion) {
      case 1:
        this.filterFuenteDatos = this.fuenteDatos.filter(
          (bank: any) => bank.Nombre.toLowerCase().indexOf(event) > -1
        );

        break;
      case 2:
        this.filterResponsables = this.responsables.filter(
          (bank: any) => bank.NOMBRE.toLowerCase().indexOf(event) > -1
        );
        break;

      default:
        break;
    }
  }
  changeIncremento(opcion:any, event:any){
    this.muestraSemaforizacion=false;
  
    if (opcion === 1) {
      this.model.esDisminuir = false;  // Deselecciona el checkbox de disminuir
    } else if (opcion === 2) {
      this.model.esIncremento = false; // Deselecciona el checkbox de incrementar
    }
    if(!this.model.esDisminuir && !this.model.esIncremento){
      this.muestraSemaforizacion=false;
      this.requiredValidityChange.emit(this.muestraSemaforizacion);
    }else{
      this.muestraSemaforizacion=true;
      this.requiredValidityChange.emit(this.muestraSemaforizacion);
    }
    
  }
}
