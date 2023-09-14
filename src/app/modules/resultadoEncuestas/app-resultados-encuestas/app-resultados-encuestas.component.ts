import { Component } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-resultados-encuestas',
  templateUrl: './app-resultados-encuestas.component.html',
  styleUrls: ['./app-resultados-encuestas.component.css']
})
export class AppResultadosEncuestasComponent {
  showModal: boolean = false;
  arrayEncuestas = [];


  constructor(
    public ApiService: ApiService,
  ) { }

  ngOnInit(): void {
  
   this.fnListEncuestas();
  }

  fnListEncuestas() {
    this.ApiService.getEncuestas().subscribe((data) => {
      this.arrayEncuestas = data;
    })
  }
}


