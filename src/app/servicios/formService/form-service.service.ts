import { Injectable } from '@angular/core';
import { ApiServiceService } from 'src/app/servicios/apiServiceForm/api-form-service.service';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  formData: ApiServiceService[] = [];

  constructor() { }

  addFormData(formData: ApiServiceService) {
    this.formData.push(formData);
  }

  getFormData() {
    return [...this.formData];
  }

}
