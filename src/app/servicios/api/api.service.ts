import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment.prod'
import { LoginI } from '../../models/loginInterface'
import { ResponseI } from '../../models/responseInterface'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiURL = environment.apiURL

  constructor(private http: HttpClient) {}

  login(form: LoginI): Observable<ResponseI> {
    const { registroNacionalDeTurismo, pass } = form
    let direccion = `${this.apiURL}/api/Usuario/LoginUsuario?usuario=${registroNacionalDeTurismo}&Password=${pass}`

    return this.http.post<any>(direccion, { registroNacionalDeTurismo, pass })
  }
  createUser(request: any): Observable<ResponseI> {
    let direccion = `${this.apiURL}/api/Usuario`
    return this.http.post<any>(direccion, request)
  }
}