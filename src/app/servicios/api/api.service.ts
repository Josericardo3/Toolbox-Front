import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginI } from '../../models/loginInterface';
import { ResponseI } from '../../models/responseInterface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url: string = 'http://10.4.3.140:8050/swagger/index.html';

  constructor(
    private http: HttpClient
  ) { }

  login(form: LoginI): Observable<ResponseI>{
    let direccion = this.url;
    return this.http.post<ResponseI>(direccion, form)
  }

}
