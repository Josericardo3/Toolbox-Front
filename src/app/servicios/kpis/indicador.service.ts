import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class IndicadorService {
  private myUrl: string = environment.apiURL;
  private myAppUrl: string = '/api/Kpi';
  constructor(private http: HttpClient) {}
  obtener(): Observable<any> {
    return this.http.get<any>(`${this.myUrl}${this.myAppUrl}`).pipe(
      catchError((error) => {
        return throwError(() =>
          console.error('Error api', JSON.stringify(error))
        );
      })
    );
  }
  obtenerTabla(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Tabla`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  obtenerCombo(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Combo`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  agregar(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Agregar`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  actualizar(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Actualizar`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  eliminar(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Eliminar`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  asignarEvaluaion(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Evaluacion`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  obtenerTablaEvaluacionIndicador(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Evaluacion/Tabla`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }

  asignarRgistroEvaluaion(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Evaluacion/Modificacion`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  obtenerDataGraficoIndicador(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Evaluacion/Grafico`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  registrarRecordatorio(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Recordatorio`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  obtnerRecordatorioNoticia(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Recordatorio/Noticia`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  obtnerRecordatorio(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Recordatorio/Listar`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  obtenerTablaEvaluacionIndicadorPorUsuarioCrea(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Evaluacion/Tabla/Recordatorio`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  obtenerComboAnios(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Combo/Anios`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
}
