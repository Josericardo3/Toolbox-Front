import { Injectable } from '@angular/core';

import {  HttpInterceptor,  HttpHandler,  HttpRequest,  HttpHeaders,  HttpErrorResponse} from '@angular/common/http';

import { catchError, throwError } from 'rxjs';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    console.log("Ingreso", request);
    const refresh = localStorage.getItem('refresh');
    //const headers = { 'Content-Type': 'application/json', 'tokenAccess': refresh || 'falta token' };
    var token:any={};
    var varRed= request;
    if(refresh){
        token = JSON.parse(refresh);
        const headers = new HttpHeaders({

        });
        varRed=request.clone({});
    }
    console.log("token:",token);
    return next.handle(varRed).pipe(catchError(this.manejarErrores));
  }

 

  manejarErrores(error: HttpErrorResponse) {
    return throwError(error);
  }

}