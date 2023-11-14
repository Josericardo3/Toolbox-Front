import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-encuesta-creada',
  templateUrl: './app-encuesta-creada.component.html',
  styleUrls: ['./app-encuesta-creada.component.css']
})

export class AppEncuestaCreadaComponent implements OnInit, AfterContentChecked{
  encuestaId: any;
  datosEncuesta: any = [];
  datosPreguntaEncuesta: any = []
  id: any;
  mostrarFormulario = true;
  public form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private ApiService: ApiService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private Message: ModalService,
    ) {}

  ngAfterContentChecked() : void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.encuestaId = params['id']
      this.getDataEncuesta(this.encuestaId);
    });
    this.form = this.formBuilder.group({})
    
  }

  formulario(){
    this.datosPreguntaEncuesta.MAE_ENCUESTA_PREGUNTAS.forEach((pregunta) => {
      if (pregunta.TIPO === 'respuestaCorta') {
        this.form.addControl(`respuestaCorta_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`, this.formBuilder.control(''));
      } else if (pregunta.TIPO === 'respuestaLarga') {
        this.form.addControl(`respuestaLarga_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`, this.formBuilder.control(''));
      } else if (pregunta.TIPO === 'radioButton') {
        this.form.addControl(`radioButton_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`, this.formBuilder.control(''));
        this.form.addControl(`radioButtonOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`, this.formBuilder.control(''));
        pregunta.mostrarOtroRadio = false;
      } else if (pregunta.TIPO === 'checkbox') {
        pregunta.VALOR.split(';').forEach((opcion) => {
          this.form.addControl(`checkbox_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`, this.formBuilder.control(''));
        });
        this.form.addControl(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`, this.formBuilder.control(''));
        pregunta.mostrarOtroCheckbox = false;
      } else if (pregunta.TIPO === 'desplegable') {
        this.form.addControl(`desplegable_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`, this.formBuilder.control(''));
      }
    });
  }

  getDataEncuesta(id: number){
    // this.ApiService.getEncuestas()
    // .subscribe(data => {
    //   this.datosEncuesta = data
      // this.datosEncuesta.sort((a, b) => b.ID_MAE_ENCUESTA - a.ID_MAE_ENCUESTA);

      // Obtiene el último ID_MAE_ENCUESTA
      // if (this.datosEncuesta.length > 0) {
        // this.id = this.datosEncuesta[0].ID_MAE_ENCUESTA;
        console.log('ID_MAE_ENCUESTA:', id);
        this.ApiService.getEncuestasRespuesta(id)
        .subscribe(respuesta => {
          this.datosPreguntaEncuesta = respuesta;
          this.formulario();
        })
      // } else {
      //   console.log('No se encontraron encuestas.');
      // }
    // });
  }

  toggleOtroRadio(pregunta, opcionSeleccionada) {
    if (opcionSeleccionada === 'Otro') {
      pregunta.mostrarOtroRadio = true;
    } else {
      pregunta.mostrarOtroRadio = false;
      this.form.get(`radioButtonOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValue('');
    }
  }

  toggleOtroCheckbox(pregunta, opcionSeleccionada) {
    if (opcionSeleccionada === 'Otro') {
        pregunta.mostrarOtroCheckbox = !pregunta.mostrarOtroCheckbox;
        if (!pregunta.mostrarOtroCheckbox) {
            this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValue('');
        }
    }
}
  
  enviarFormulario() {
    const respuestas = [];
  
    this.datosPreguntaEncuesta.MAE_ENCUESTA_PREGUNTAS.forEach((pregunta, index) => {
      const tipo = pregunta.TIPO;
      let respuesta = '';
  
      if (tipo === 'respuestaCorta') {
        respuesta = this.form.get(`respuestaCorta_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value || '';
      } else if (tipo === 'respuestaLarga') {
        respuesta = this.form.get(`respuestaLarga_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value || '';
      } else if (tipo === 'radioButton') {
        pregunta.VALOR.split(';').forEach((opcion, i) => {
          const valor = this.form.get(`radioButton_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value;
          if (valor === opcion) {
            respuesta = valor;
          }
        });
        if (pregunta.mostrarOtroRadio) {
          const valorOtro = this.form.get(`radioButtonOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value;
          if (valorOtro) {
            respuesta = valorOtro;
          }
        }
      } else if (tipo === 'checkbox') {
        const opcionesSeleccionadas = pregunta.VALOR.split(';').filter((opcion, i) => {
          const isChecked = this.form.get(`checkbox_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value;
          return isChecked;
        });

        if (opcionesSeleccionadas.length > 0) {
            respuesta = opcionesSeleccionadas.join(', ');
        }

        if (pregunta.mostrarOtroCheckbox) {
            const valorOtro = this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value;
            if (valorOtro) {
                respuesta += (respuesta ? ', ' : '') + valorOtro;
            }
        }
      } else if (tipo === 'desplegable') {
        respuesta = this.form.get(`desplegable_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value || '';
      }
  
      if (respuesta) {
        const respuestaFormato = {
          FK_ID_MAE_ENCUESTA_PREGUNTA: pregunta.ID_MAE_ENCUESTA_PREGUNTA,
          RESPUESTA: respuesta.toString()
        };
        respuestas.push(respuestaFormato);
      }
    });
  
    console.log(respuestas);
    this.ApiService.saveEncuestaRespuesta(respuestas)
      .subscribe((data) => {
        this.mostrarFormulario = false;
        const title = "ENCUESTA COMPLETADA";
        const message = "Se completó la encuesta correctamente"
        this.Message.showModal(title, message);
        
      });
  }
}