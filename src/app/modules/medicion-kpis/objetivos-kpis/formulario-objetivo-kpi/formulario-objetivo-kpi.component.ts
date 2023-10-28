import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario-objetivo-kpi',
  templateUrl: './formulario-objetivo-kpi.component.html',
  styleUrls: ['./formulario-objetivo-kpi.component.css'],
})
export class FormularioObjetivoKpiComponent {
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
  onSliderChange(event: any) {
    this.model.VAL_CUMPLIMIENTO = event.target.value;
  }
}
