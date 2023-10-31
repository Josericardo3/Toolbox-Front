import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';

@Component({
  selector: 'app-formulario-registro-evaluacion-indicador',
  templateUrl: './formulario-registro-evaluacion-indicador.component.html',
  styleUrls: ['./formulario-registro-evaluacion-indicador.component.css'],
})
export class FormularioRegistroEvaluacionIndicadorComponent {
  @Input() model: any = {};
  @Input() acciones: any = [];
  requiredFieldsValid: boolean = false;
  @Output() requiredValidityChange = new EventEmitter<boolean>();

  dataSource: any = [];
  displayedColumns: string[] = [];
  habilitaCampo: boolean = true;
  get dynamicColumns(): string[] {
    return this.model.VARIABLES_EVALUACION.map((variable) => variable.NOMBRE);
  }

  // Obtener un array de todas las columnas, incluyendo las adicionales
  get columns(): string[] {
    return [
      'PERIODO',
      ...this.dynamicColumns,
      'RESULTADO',
      'META',
      'ESTADO',
      'ANALISIS',
      'ACCION',
      'OPCION',
    ];
  }
  @ViewChild('formObjetivo') formObjetivo: NgForm;
  constructor(private modalService: ModalService,) {
    this.dataSource.push(this.model);
  }

  submitForm(formObjetivo: any) {
    this.requiredFieldsValid =
      formObjetivo.form.status === 'INVALID' ? false : true;
    this.requiredValidityChange.emit(this.requiredFieldsValid);
    console.log("dddd",formObjetivo,"requiredddd::::",this.requiredFieldsValid)
  }
  calcular() {
    this.requiredFieldsValid=false;
    this.habilitaCampo = true;
  delete this.model.ID_ACCION;
    //const expresion = 'Variable 3 a+Variable 2 e*Variable 1';

    const filtroFormula = this.model.FORMULA_TEXT.split(/([+\-*()\/])/).filter(
      (token) => token.trim() !== ''
    );

    var formulaConNumero = '';
    var ultimoVarEsOperador = true; // Inicializado en true para evitar un operador al principio
    let variablesEnFila = 0; // Contador de variables en la fila
const variables = this.model.VARIABLES_EVALUACION;
    console.log("sdddddd",filtroFormula)
    for (let j = 0; j < filtroFormula.length; j++) {
      const variableNombre = filtroFormula[j];

  // Encuentra la variable por nombre
  const variable = variables.find(
    (v) => v.NOMBRE.toUpperCase() === variableNombre.toUpperCase()
  );

  if (variable) {
    if (!ultimoVarEsOperador) {
      formulaConNumero += ' ';
    }

    // Utiliza variablesEnFila para determinar qué variable usar
    formulaConNumero += variables[variablesEnFila].VALOR;
    ultimoVarEsOperador = false;

    // Incrementa el contador de variables en la fila
    variablesEnFila = (variablesEnFila + 1) % variables.length;
  } else if (['+', '-', '*', '/', '(', ')'].includes(variableNombre.toLowerCase())) {
    formulaConNumero += variableNombre;
    ultimoVarEsOperador = true;
  }
    }

    const resultado = eval(formulaConNumero);

    const result: any = parseFloat(resultado.toFixed(2)).toFixed(2);
    if(result=='NaN' || result=='Infinity'){
      this.modalService.showModal("Alerta", 'La operación no puede ser procesada');
      return;
    }
    console.log("sss",result)
    this.model.RESULTADO = result;

    if (resultado >= this.model.META) {
      this.habilitaCampo = false;
      this.model.ESTADO = 'CUMPLE';
      this.requiredValidityChange.emit(true);
    } else {
      this.model.ESTADO = 'NO CUMPLE';
      this.requiredValidityChange.emit(false);
    }
  }
}
