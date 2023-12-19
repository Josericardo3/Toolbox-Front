import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private location: Location) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    // Obtener la propiedad específica desde la configuración de la ruta
    const propiedadRuta = route.data.propiedad;

    // Obtener los permisos desde el localStorage
    const permisos = JSON.parse(localStorage.getItem('acessos'));
    if (propiedadRuta[0] == 'dashboard' && !permisos) {
      const tipo = JSON.parse(localStorage.getItem('TIPO_USUARIO'));
      if (tipo == 2) {
        this.router.navigate(['/page/error']);
        return false;
      }
      return true;
    }
    if (permisos) {
      const tipo = JSON.parse(localStorage.getItem('TIPO_USUARIO'));

      // Verificar si la propiedad específica tiene un valor 'x'
      if (
        permisos &&
        (permisos[propiedadRuta] === 'x' || propiedadRuta[0] == 'dashboard')
      ) {
        if (tipo == 2) {
          this.router.navigate(['/gestionUsuario']);
          return false;
        }

        return true; // Permitir la navegación si la propiedad específica tiene el valor 'x'
      } else {
        this.router.navigate(['/page/error']);
        return false; // Bloquear la navegación
      }
    } else {
      this.router.navigate(['']);
      return false; // Bloquear la navegación
    }
  }
  canLoad(): Observable<boolean> | boolean {
    return true;
  }
}
