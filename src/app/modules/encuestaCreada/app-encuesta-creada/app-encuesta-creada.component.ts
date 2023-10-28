import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-encuesta-creada',
  templateUrl: './app-encuesta-creada.component.html',
  styleUrls: ['./app-encuesta-creada.component.css']
})
export class AppEncuestaCreadaComponent implements OnInit, AfterContentChecked{
  encuestaId: string;
  datosEncuesta: any = [];
  datosPreguntaEncuesta: any = []
  id: any;
  public form: FormGroup;
  public otroControlRadio: FormControl = this.formBuilder.control({value: '', disabled: true});
  public otroControlCheckbox: FormControl = this.formBuilder.control({value: '', disabled: true}, Validators.required);

  constructor(
    private route: ActivatedRoute,
    private ApiService: ApiService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    ) {}

  ngAfterContentChecked() : void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.encuestaId = params['id']
    });
    this.form = this.formBuilder.group({})
    this.getDataEncuesta();
  }

  formulario(){
    this.datosPreguntaEncuesta.MAE_ENCUESTA_PREGUNTAS.forEach((pregunta, index) => {
      if (pregunta.TIPO === 'respuestaCorta') {
        this.form.addControl(`respuestaCorta_${index}`, this.formBuilder.control(''));
      } else if (pregunta.TIPO === 'respuestaLarga') {
        this.form.addControl(`respuestaLarga_${index}`, this.formBuilder.control(''));
      } else if (pregunta.TIPO === 'radioButton') {
        pregunta.VALOR.split(';').forEach((opcion, i) => {
          this.form.addControl(`radioButton_${i}`, this.formBuilder.control(''));
        });
        if (pregunta.VALOR.includes('otroRadio')) {
          this.form.addControl(`otroControlRadio_${index}`, this.otroControlRadio);
        }
      } else if (pregunta.TIPO === 'checkbox') {
        pregunta.VALOR.split(';').forEach((opcion, i) => {
          this.form.addControl(`checkbox_${i}`, this.formBuilder.control(false));
        });
        // if (pregunta.VALOR.includes('otroCheckbox')) {
        //   this.form.addControl(`otroControlCheckbox_${index}`, this.otroControlCheckbox);
        // }
      } else if (pregunta.TIPO === 'desplegable') {
        this.form.addControl(`desplegable_${index}`, this.formBuilder.control(''));
      }
    });
  }

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
          this.formulario();
        })
      } else {
        console.log('No se encontraron encuestas.');
      }
    });
  }

  toggleOtroRadioInput(index: number) {
    const otroRadio = document.getElementById('otroRadio_' + index) as HTMLInputElement;
    if (otroRadio) {
        if (otroRadio.checked) {
          this.otroControlRadio.enable({ emitEvent: false });
        } else {
          this.otroControlRadio.disable({ emitEvent: false });
        }
    }
  }
  
  toggleOtroCheckboxInput(index: number) {
    const otroCheck = document.getElementById('otroCheckbox_' + index) as HTMLInputElement;
    if (otroCheck) {
      if (otroCheck.checked) {
        this.otroControlCheckbox.enable({ emitEvent: false });
        this.otroControlCheckbox.setValidators(Validators.required);
        this.otroControlCheckbox.updateValueAndValidity();
      } else {
        this.otroControlCheckbox.disable({ emitEvent: false });
        this.otroControlCheckbox.clearValidators();
        this.otroControlCheckbox.updateValueAndValidity();
      }
    }
  }
  
  
  enviarFormulario(){
    const respuestas = [];

    this.datosPreguntaEncuesta.MAE_ENCUESTA_PREGUNTAS.forEach((pregunta, index) => {
      const tipo = pregunta.TIPO;
      let respuesta = '';
  
      if (tipo === 'respuestaCorta') {
        respuesta = this.form.get(`respuestaCorta_${index}`).value || '';
      } else if (tipo === 'respuestaLarga') {
        respuesta = this.form.get(`respuestaLarga_${index}`).value || '';
      } else if (tipo === 'radioButton') {
        pregunta.VALOR.split(';').forEach((opcion, i) => {
          const valor = this.form.get(`radioButton_${i}`).value;
          if (valor) {
            respuesta = valor;
          }
        })
        if (pregunta.VALOR.includes('otroRadio')) {
          const otroRadioValor = this.otroControlRadio.value;
          if (otroRadioValor) {
            respuesta = otroRadioValor;
          }
        }
      } else if (tipo === 'checkbox') {
        const opcionesSeleccionadas = [];

        pregunta.VALOR.split(';').forEach((opcion, i) => {
          const isChecked = this.form.get(`checkbox_${i}`).value;
          if (isChecked) {
            opcionesSeleccionadas.push(opcion);
          }
          respuesta = opcionesSeleccionadas.join(', ');
        }); 
      } else if (tipo === 'desplegable') {
        respuesta = this.form.get(`desplegable_${index}`).value || '';
      }
  
      if (respuesta) {
        const respuestaFormato = {
          FK_ID_MAE_ENCUESTA_PREGUNTA: index,
          RESPUESTA: respuesta.toString()
        };
        respuestas.push(respuestaFormato);
      }
    });

    console.log(respuestas);
    this.ApiService.saveEncuestaRespuesta(respuestas)
      .subscribe(data => {
        console.log(data)
      });
  }
}