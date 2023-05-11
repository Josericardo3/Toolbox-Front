import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';

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
    const request = this.rolesArraytemp[this.indice].id;
    this.ApiService.deleteActivities(request).subscribe((data) => {
      this.fnConsultActivities();
   })

  }
  cancelDelete(): void {
    // Lógica para cancelar la eliminación
  }
}
