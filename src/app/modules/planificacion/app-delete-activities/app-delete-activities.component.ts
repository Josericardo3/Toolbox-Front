import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import {AppPlanificacionComponent} from '../app-planificacion/app-planificacion.component'
import { Console } from 'console';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
@Component({
  selector: 'app-app-delete-activities',
  templateUrl: './app-delete-activities.component.html',
  styleUrls: ['./app-delete-activities.component.css']
})
export class AppDeleteActivitiesComponent {
  @Input() indice: number;
  public message: string;
  @Output() valorEnviado = new EventEmitter<number>();

  constructor(
    public ApiService: ApiService,
    public AppPlanificacionComponent: AppPlanificacionComponent,
    private Message: ModalService,
  ) { }
  ngOnInit() {
  this.fnConsultActivities() 

  }
  enviarValor() {
    const valor = -1 ;
    this.valorEnviado.emit(valor);
  }
  rolesArraytemp: any =[];
  fnConsultActivities() {
    this.ApiService.getActivities().subscribe((data) => {
      this.rolesArraytemp = data;
    })}

  confirmDelete(): void {
    const valor = -2 ;
    this.ApiService.deleteActivities(this.indice).subscribe((data) => {
      const title = "Eliminación exitosa";
      const message = "El registro se ha eliminado exitosamente"
      this.Message.showModal(title, message);
      this.AppPlanificacionComponent.fnConsultActivities();
        this.valorEnviado.emit(valor);
   })

  }
  cancelDelete(): void {
    // Lógica para cancelar la eliminación
  }
}
