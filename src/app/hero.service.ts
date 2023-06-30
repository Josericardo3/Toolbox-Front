import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private url = 'https://toolbox3-001-site1.etempurl.com/api/MatrizLegal/RespuestaMatrizLegal';

  constructor(private http: HttpClient) {}

  guardarEstadoFormulario(idMatriz: number, estado: any) {
    const data = {
      fK_ID_MATRIZ_LEGAL: idMatriz,
      formulario: estado
    };

    return this.http.post(this.url, data);
  }
}
