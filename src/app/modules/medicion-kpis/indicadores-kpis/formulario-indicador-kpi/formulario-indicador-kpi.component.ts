import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { helpers } from '../../../Helpers/helpers';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { GestionVariableKpiComponent } from '../../variables/gestion-variable-kpi/gestion-variable-kpi.component';
import { MatDialog } from '@angular/material/dialog';
import { VariableService } from 'src/app/servicios/kpis/variable.service';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';

@Component({
  selector: 'app-formulario-indicador-kpi',
  templateUrl: './formulario-indicador-kpi.component.html',
  styleUrls: ['./formulario-indicador-kpi.component.css'],
})
export class FormularioIndicadorKpiComponent {
  dataSource: any = [];

  @Input() model: any = {};
  @Input() periodos: any = [];
  @Input() variables: any = [];
  @Input() paquetes: any = [];
  @Input() objetivos: any = [];
  dataEnvio:any={}
  filterVariables: any;
  filterObjetivos: any;
  filter:any={}
  filterPeriodos: any;
  tipoFilterCtrl: FormControl = new FormControl();
  variablesT: any = [];
  variablesTemporales: any = [];
  requiredFieldsValid: boolean = false;
  @Output() requiredValidityChange = new EventEmitter<boolean>();
  contenidoDivEditable: any;
  @ViewChild('divEditable', { static: true }) divEditable!: ElementRef;
  @ViewChild(MatSelect) matSelect: MatSelect;
  selectedElement: string = 'boton';
  constructor( private variableService: VariableService,
    private _dialog: MatDialog,
    private modalService: ModalService) {}
  ngOnInit() {
    this.filterObjetivos = this.objetivos;
    this.filterPeriodos = this.periodos;
    this.filterVariables = this.variables;
    if (this.model.FORMULA_HTML != undefined) {
      this.divEditable.nativeElement.innerHTML = this.model.FORMULA_HTML;
    }
  }
  onSearchInputChange(opcion: number, event: any) {
    //event=event.target.value;
    switch (opcion) {
      case 2:
        this.filterVariables = this.variables.filter(
          (bank: any) => bank.Nombre.toLowerCase().indexOf(event) > -1
        );
        break;
      case 3:
        this.filterPeriodos = this.periodos.filter(
          (bank: any) => bank.Nombre.toLowerCase().indexOf(event) > -1
        );
        break;
      case 4:
        this.filterObjetivos = this.objetivos.filter(
          (bank: any) => bank.Nombre.toLowerCase().indexOf(event) > -1
        );
        break;

      default:
        break;
    }
  }
  seleccionarTodo(event) {
    this.matSelect.options.forEach((option) => option.select());
  }
  onInputChange(event) {
    this.contenidoDivEditable = this.divEditable.nativeElement.innerHTML;
  }

  addElement(sele: any, select: any) {
    var ecuacion: any;
    
    if (select != undefined) {
      sele = select.source.triggerValue;
      var objt:any={ID:select.value,NOMBRE:sele}
      this.variablesTemporales.push(objt)
    }
    
    const newElement = document.createElement('button');
    if (sele == 'prom') {
      sele == 'avg';
    }
    newElement.textContent = sele;

    newElement.contentEditable = 'false';
    newElement.style.marginRight = '1rem';
    newElement.classList.add('btn', 'btn-primary', 'btn-sm', 'mr-1', 'ml-1','mb-2');
    if (
      sele == '(' ||
      sele == ')' ||
      sele == '+' ||
      sele == '-' ||
      sele == '*' ||
      sele == '/' ||
      sele == 'prom'
    ) {
      newElement.classList.add('btn', 'btn-success', 'btn-sm', 'mr-1', 'ml-1');
      newElement.textContent = sele;
    } else {
    }

    const divEditableElement = this.divEditable.nativeElement;
    // Agrega el nuevo elemento como hijo del divEditable
    divEditableElement.appendChild(newElement);
    divEditableElement.focus();
    newElement.addEventListener('click', () => {
      
      this.model.formula = this.variablesT.join(' ');
      divEditableElement.removeChild(newElement);
      this.model.FORMULA_HTML = divEditableElement.innerHTML;
      this.model.FORMULA_TEXT = divEditableElement.innerText;
      this.model.FORMULA_VALUE = divEditableElement.value;

      //this.model.variables = this.variablesT;
      ecuacion = this.model.FORMULA_TEXT.split(/([+\-*()\/])/).filter(
        (token) => token.trim() !== ''
      );
      this.establecerFormula(ecuacion);
    });
    
    this.model.FORMULA_HTML = divEditableElement.innerHTML;
    this.model.FORMULA_TEXT = divEditableElement.innerText;
    this.model.FORMULA_VALUE = divEditableElement.value;
    if(this.model.FORMULA_TEXT==""){
      this.variablesTemporales=[]
    }
    this.model.formula = this.variablesT.join(' ');
    this.model.variablesR = this.variablesT;
    ecuacion = this.model.FORMULA_TEXT.split(/([+\-*()\/])/).filter(
      (token) => token.trim() !== ''
    );
    this.establecerFormula(ecuacion);
    
    
  }
  establecerFormula(ecuacion:any){
    var operadoresExclusion=['+', '-', '*', '/', '(', ')'];
    var formulaConNumero = '';
    var ultimoVarEsOperador = true; 
    for (let j = 0; j < ecuacion.length; j++) {
      if (
        this.variablesTemporales.some(
          (variable) =>
            variable.NOMBRE.toUpperCase() === ecuacion[j].toUpperCase()
        )
      ) {
        const variable = this.variablesTemporales.find(
          (variable) =>
            variable.NOMBRE.toUpperCase() === ecuacion[j].toUpperCase()
        );

        if (!ultimoVarEsOperador) {
          formulaConNumero += ' ';
        }
        formulaConNumero += variable.ID;
        ultimoVarEsOperador = false;
      } else if (
        ['+', '-', '*', '/', '(', ')'].includes(ecuacion[j].toLowerCase())
      ) {
        formulaConNumero += ecuacion[j];
        ultimoVarEsOperador = true;
      }
    }
    const variables = formulaConNumero.split(/([+\-*()\/])/).filter(
      (token) => token.trim() !== ''
    );
    
   
    const variablesEnvio = variables.filter((element) => !operadoresExclusion.includes(element));
    this.model.formula=formulaConNumero;
    this.model.VARIABLES=variablesEnvio;
    
  }
  modelo() {}
  clearDisplay() {
    this.divEditable.nativeElement.innerHTML = '';
    this.model.FORMULA_HTML="";
    this.model.FORMULA_TEXT = "";
    this.model.FORMULA_VALUE = "";
    this.variablesT=[];
    this.variablesTemporales=[]
  }

  submitForm(formObjetivo: any) {
    this.requiredFieldsValid =
      formObjetivo.form.status === 'INVALID' ? false : true;
    this.requiredValidityChange.emit(this.requiredFieldsValid);
  }
  seleccionar(event: any) {}
  addElementVariable(selectedElement, event: any) {}

  aniadirVariable(numero: number, info: any) {
    if (numero == 1) {
      this.dataEnvio = { numero: numero, VAL_CUMPLIMIENTO: 0 };
    } else {
      info.numero = numero;
      this.dataEnvio = info;
    }
    this.abrirDialog();
  }
  abrirDialog() {
    
    var dialogRef = this._dialog.open(GestionVariableKpiComponent, {
      data: [this.dataEnvio],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.opcion == 1) {
        this.modalService.showModal(result.title, result.mensaje);
        this.obtenerComboVariables();
      } else {
        //this.dataSource = temp;
      }
    });
  }
  obtenerComboVariables() {
    this.variableService.obtenerCombo(this.filter).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.variables = x.Data;
        } else {
        }
      },
      error: (e) => {},
    });
  }
}
