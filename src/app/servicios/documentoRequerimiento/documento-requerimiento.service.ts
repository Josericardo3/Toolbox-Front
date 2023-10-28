import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root',
})
export class DocumentoRequerimientoService {
  private myUrl: string = environment.apiURL;
  private myAppUrl: string = '/api/DocumentoRequerimiento';
  constructor(private http: HttpClient){}
 
  registrar(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  obtenerDocumentos(model: any): Observable<any> {
    return this.http
      .post<any>(`${this.myUrl}${this.myAppUrl}/Documentos`, model)
      .pipe(
        catchError((error) => {
          return throwError(() =>
            console.error('Error api', JSON.stringify(error))
          );
        })
      );
  }
  
}