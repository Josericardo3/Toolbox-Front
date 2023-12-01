import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';


@Injectable({
  providedIn: 'root',
})
export class helpers {
  data!: string;
  icono!: string;
  titulo!: string;
  color!: string;
  descripcion!: string;
  tieneIcono: any = true;
  muestraAceptar: any = true;
  muestraCancelar: any = true;
  constructor(private dialog: MatDialog) {}
openDialog(opcion: string, descripcion: string = ''): void {
    switch (opcion) {

      case 'delete':
        this.data = '';
        this.icono = 'error_outline';
        this.titulo = 'Confirmar Eliminación';
        this.descripcion =
          descripcion != '' ? descripcion : 'La data se borrará permanetemente';
        (this.color = 'warning'), (this.muestraAceptar = true);
        this.muestraCancelar = true;
        break;
      case 'success':
        this.data = '';
        this.icono = 'check_circle_outline';
        this.titulo = 'Correcto';
        this.descripcion =
          descripcion != '' ? descripcion : 'Registrado Correctamente';
        this.color = 'success';
        this.muestraAceptar = false;
        break;
      case 'update':
        this.data = '';
        this.icono = 'check_circle_outline';
        this.titulo = 'Correcto';
        this.descripcion =
          descripcion != '' ? descripcion : 'Actualizado Correctamente';
        this.color = 'success';
        this.muestraAceptar = false;
        break;
      case 'info':
        this.data = '';
        this.icono = 'error_outline';
        this.titulo = '¿Está Seguro?';
        this.descripcion =
          descripcion != ''
            ? descripcion
            : 'La data se actualizará permanetemente';
        this.color = 'warning';

        break;

      default:
        this.data = `<div class="spinner-border text-primary mt-5 mb-4" role="status" style="width: 7rem; height: 7rem;">
                <span class="visually-hidden">Cargando...</span>
                </div>`;
        this.icono = '';
        this.titulo = 'Registrando....';
        this.descripcion = descripcion != '' ? descripcion : '';
        this.color = 'primary';
        this.tieneIcono = false;
        this.muestraAceptar = false;
        this.muestraCancelar = false;
        break;
    }
    const dialogRef = this.dialog.open(AlertComponent, {
      
      data: {
        icono: this.icono,
        titulo: this.titulo,
        message: this.data,
        descripcion: this.descripcion,
        color: this.color,
        tieneIcono: this.tieneIcono,
        muestraAceptar: this.muestraAceptar,
        muestraCancelar: this.muestraCancelar,
      },
    });
  }
  esOperacionMatematicaValida(input: string): boolean {
    
    const regex = /^[0-9+\-*/().\s]+$/;
  
    const expresionConPromedio = input.replace(/avg/g, " ( avg ) ");

    if (!regex.test(expresionConPromedio)) {
      return false; // La entrada contiene caracteres no válidos.
    }
  
    try {
      const resultado = eval(expresionConPromedio);
  
      if (isNaN(resultado) || !isFinite(resultado)) {
        return false; // La expresión no es válida o produce un resultado no numérico.
      }
  
      return true; // La expresión es válida.
    } catch (error) {
      return false; // Error durante la evaluación de la expresión.
    }
  }
  obtenerArrayAnios():any{
    const currentYear = new Date().getFullYear();
    const anios = [];
    
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      anios.push({ Id: i+'', Nombre: i+'' });
    }
    
    return anios;
  }
  convertirHora(hora: Date): string {


    const horas = hora.getHours();
    const minutos = hora.getMinutes();
   // const amPm = horas < 12 ? 'AM' : 'PM';
   // const hora12h = horas % 12 || 12; // Convierte 0 a 12 en el formato de 12 horas

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  }
  convertirFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');

    const fechaConvertida = `${anio}, ${mes}, ${dia}`;

    return fechaConvertida;
  }
  calcular(nMeta,esIncremento:any,esDisminuir,nResultado:any):string{
    var respuesta="";
    if(esIncremento){
      if(nResultado>=(Number(nMeta)+11)){
        respuesta="green";
        return respuesta;
      }
      if(nResultado>=(Number(nMeta)) && nResultado<=(Number(nMeta)+10)){
        respuesta="yellow";
        return respuesta;
      }
      if(nResultado<=(nMeta-1)){
        respuesta="red";
        return respuesta;
      }
    }
    if(esDisminuir){
      if( nResultado>0 && nResultado<=(nMeta-11)){
        respuesta="green";
        return respuesta;
      }
      if(nResultado<=(Number(nMeta)) && nResultado>=(nMeta-10)){
        respuesta="yellow";
        return respuesta;
      }
      if(nResultado>=(Number(nMeta)+1)){
        respuesta="red";
        return respuesta;
      }
    }
    return respuesta;
  }
}