import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-formulario-paquete-kpi',
  templateUrl: './formulario-paquete-kpi.component.html',
  styleUrls: ['./formulario-paquete-kpi.component.css'],
})
export class FormularioPaqueteKpiComponent {
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
