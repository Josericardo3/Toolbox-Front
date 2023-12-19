import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // Get the access token from your authentication service

    const value = localStorage.getItem('access');

    var dataToken: any = {};
    var authReq = request;
    
    if (value) {
      
   

      const headers = new HttpHeaders({
        token: value,
      });

      // Clone the request and add the authorization header
      authReq = request.clone({
        headers: request.headers.set(
          'Authorization',
          `Bearer ${value}`
        ),
      });
    }
   

    // Pass the cloned request instead of the original request to the next interceptor or to the HttpHandler
    return next.handle(authReq).pipe(catchError(this.manejarErrores));
  }

  manejarErrores(error: HttpErrorResponse) {
 
    
    if (error.status == 401 || error.status == 0 ) {
      // Redirigir al usuario a la página de inicio de sesión
      window.location.href = '/';
    
      //alert(error.status)
    }
    return throwError(error);
  }
}
