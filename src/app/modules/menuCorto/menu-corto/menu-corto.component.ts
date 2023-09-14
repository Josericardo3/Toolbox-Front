import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-corto',
  templateUrl: './menu-corto.component.html',
  styleUrls: ['./menu-corto.component.css']
})
export class MenuCortoComponent {

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }
}
