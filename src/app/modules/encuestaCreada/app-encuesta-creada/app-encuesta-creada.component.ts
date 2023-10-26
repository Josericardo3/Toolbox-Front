import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-encuesta-creada',
  templateUrl: './app-encuesta-creada.component.html',
  styleUrls: ['./app-encuesta-creada.component.css']
})
export class AppEncuestaCreadaComponent implements OnInit{
  encuestaId: string;
  datosEncuesta: any = [];
  datosPreguntaEncuesta: any = []
  public form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private ApiService: ApiService,
    private formBuilder: FormBuilder,) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.encuestaId = params['id']
    });
    this.getDataEncuesta();
    // this.getPreguntasEncuesta();
    this.formulario();
  }

  formulario(){
    this.form = this.formBuilder.group({
      respuestaCorta: [''],
      respuestaLarga: [''],
      // radioButton: this.formBuilder.array([]),
      radioButtonOptions: this.formBuilder.group({}),
      desplegableOption: [''],
    });
  }

  id: any;
  getDataEncuesta(){
    this.ApiService.getEncuestas()
    .subscribe(data => {
      this.datosEncuesta = data
      this.datosEncuesta.sort((a, b) => b.ID_MAE_ENCUESTA - a.ID_MAE_ENCUESTA);

      // Obtiene el último ID_MAE_ENCUESTA
      if (this.datosEncuesta.length > 0) {
        this.id = this.datosEncuesta[0].ID_MAE_ENCUESTA;
        console.log('ID_MAE_ENCUESTA:', this.id);
        this.ApiService.getEncuestasRespuesta(this.id)
        .subscribe(respuesta => {
          this.datosPreguntaEncuesta = respuesta;
          console.log(this.datosPreguntaEncuesta.TITULO)
          console.log('Respuesta:', this.datosPreguntaEncuesta);
        })
      } else {
        console.log('No se encontraron encuestas.');
      }
    });
  }

  enviarFormulario(){}
}
