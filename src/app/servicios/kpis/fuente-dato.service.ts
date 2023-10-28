import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class FuenteDatoService {
  private myUrl: string = environment.apiURL;
  private myAppUrl: string = '/api/FuenteDato';
  constructor(private http: HttpClient) {}

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
}
