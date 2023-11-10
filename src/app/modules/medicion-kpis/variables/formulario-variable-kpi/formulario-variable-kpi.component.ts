import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-formulario-variable-kpi',
  templateUrl: './formulario-variable-kpi.component.html',
  styleUrls: ['./formulario-variable-kpi.component.css']
})
export class FormularioVariableKpiComponent {
  dataSource: any = [];
  @Input() model: any = {};

  requiredFieldsValid: boolean = false;
  @Output() requiredValidityChange = new EventEmitter<boolean>();
  constructor() {}

  submitForm(formObjetivo: any) {
    this.requiredFieldsValid =
      formObjetivo.form.status === 'INVALID' ? false : true;
    this.requiredValidityChange.emit(this.requiredFieldsValid);
  }
}
