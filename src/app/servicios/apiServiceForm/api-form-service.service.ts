import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  apiURL = environment.apiURL
  constructor(private http: HttpClient) { }

  getData(data: any) {
    const {id} = data;
    // let direccion = `${this.apiURL}/api/Usuario/caracterizacion/${id}`
    return this.http.get(`${this.apiURL}/api/Caracterizacion/caracterizacion/${id}`, data);
  }

  submitForm(data: any) {
    const {id} = data;
    return this.http.post(`${this.apiURL}/api/Caracterizacion/caracterizacion/${id}`, data);
  }
}
