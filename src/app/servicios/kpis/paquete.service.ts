import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root',
})
export class PaqueteService {
  private myUrl: string = environment.apiURL;
  private myAppUrl: string = '/api/Paquete';
  constructor(private http: HttpClient){}
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
}