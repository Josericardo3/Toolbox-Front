import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-result-encuestas-preguntas',
  templateUrl: './app-result-encuestas-preguntas.component.html',
  styleUrls: ['./app-result-encuestas-preguntas.component.css']
})
export class AppResultEncuestasPreguntasComponent implements OnInit {

  datos: any[] = [];
  datosResultados: any = [];
  id: any;
  idEncuesta: number;
  numEncuestado: number;

  constructor(
    private ApiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.idEncuesta = +params['id'];
      this.numEncuestado = +params['numEncuestado'];
    });

    this.getResultados();
  }

  getResultados() {
    this.ApiService.getEncuestasResultados(this.idEncuesta)
      .subscribe(data => {
        // Find the item where NUM_ENCUESTADO matches numEncuestado
        const foundItem = data.find((item: any) => item.RESPUESTA.some((respuesta: any) => respuesta.NUM_ENCUESTADO === this.numEncuestado));

        if (foundItem) {
          // Filter the RESPUESTA array based on NUM_ENCUESTADO
          foundItem.RESPUESTA = foundItem.RESPUESTA.filter((respuesta: any) => respuesta.NUM_ENCUESTADO === this.numEncuestado);
          this.datos = [foundItem];
          console.log(this.datos);
        }
      })
  }

}
