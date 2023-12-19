import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NoEspacioDirective } from 'src/app/directives/no-espacio.directive';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-encuesta-creada',
  templateUrl: './app-encuesta-creada.component.html',
  styleUrls: ['./app-encuesta-creada.component.css']
})

export class AppEncuestaCreadaComponent implements OnInit, AfterContentChecked {
  encuestaId: any;
  datosEncuesta: any = [];
  datosPreguntaEncuesta: any = []
  id: any;
  mostrarFormulario = true;
  public form: FormGroup;
  checkObligatorio = false;

  constructor(
    private route: ActivatedRoute,
    private ApiService: ApiService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private Message: ModalService,
  ) { }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.encuestaId = params['id']
      this.getDataEncuesta(this.encuestaId);
    });
    this.form = this.formBuilder.group({})

  }

  formulario() {
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
        pregunta.VALOR.split(';').forEach((opcion, i) => {
          this.form.addControl(`checkbox_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}_${i}`, this.formBuilder.control(''));
        });
        this.form.addControl(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`, this.formBuilder.control(''));
        pregunta.mostrarOtroCheckbox = false;
        pregunta.OBLIGATORIO2 = pregunta.OBLIGATORIO
      } else if (pregunta.TIPO === 'desplegable') {
        this.form.addControl(`desplegable_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`, this.formBuilder.control(''));
      }
    });
  }

  getDataEncuesta(id: number) {
    console.log('ID_MAE_ENCUESTA:', id);
    this.ApiService.getEncuestasRespuesta(id)
      .subscribe(respuesta => {
        const tarjetasOrdenadas = [...respuesta.MAE_ENCUESTA_PREGUNTAS];
        tarjetasOrdenadas.sort((a, b) => a.ORDEN - b.ORDEN);
        this.datosPreguntaEncuesta = respuesta;
        // const tarjetasOrdenadas = [...this.datosPreguntaEncuesta];
        // tarjetasOrdenadas.sort((a, b) => a.ORDEN - b.ORDEN);
        // this.datosPreguntaEncuesta = tarjetasOrdenadas
        // this.formulario();
        tarjetasOrdenadas.forEach(pregunta => {
          // Agregar lógica para crear controles en el formulario
          // Por ejemplo, para un campo de respuesta corta:
          // this.form.addControl(
          //   `respuestaCorta_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`,
          //   this.formBuilder.control('', [Validators.required])
          // );
        

        this.datosPreguntaEncuesta = { ...respuesta, MAE_ENCUESTA_PREGUNTAS: tarjetasOrdenadas };
        this.formulario();
      });
      })
  }

  toggleOtroRadio(pregunta, opcionSeleccionada) {
    if (opcionSeleccionada === 'Otro') {
      pregunta.mostrarOtroRadio = true;
      this.form.get(`radioButtonOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValue('');
      this.form.get(`radioButtonOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValidators([Validators.required]);
    this.form.get(`radioButtonOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).updateValueAndValidity();
    } else {
      pregunta.mostrarOtroRadio = false;
      this.form.get(`radioButtonOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValue('');
      this.form.get(`radioButtonOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).clearValidators();
      this.form.get(`radioButtonOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).updateValueAndValidity();
    }
  }

  mostrarOtroCheckbox: boolean = false;
  toggleOtroCheckbox(pregunta: any, opcionSeleccionada, j, evento: any) {   
    if (opcionSeleccionada === 'Otro') {
        console.log(opcionSeleccionada)
      pregunta.mostrarOtroCheckbox = !pregunta.mostrarOtroCheckbox;
      
      if (!pregunta.OBLIGATORIO) {
        console.log(pregunta.ID_MAE_ENCUESTA_PREGUNTA)
        pregunta.OBLIGATORIO2 = false;
        
        // pregunta.OBLIGATORIO = false;
        // if (this.mostrarOtroCheckbox) {
          this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValue('');
          this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).clearValidators();
        this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).updateValueAndValidity();
        // }
        if (pregunta.mostrarOtroCheckbox) {
          //pregunta.OBLIGATORIO2 = false;
          this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValue('');
          this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValidators([Validators.required]);
        this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).updateValueAndValidity();
          // this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).clearValidators();
           //this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).updateValueAndValidity();
        }
        return
      }
      
      //pregunta.OBLIGATORIO2 = false;

      if (pregunta.mostrarOtroCheckbox) {
        //pregunta.OBLIGATORIO2 = false;
        this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValue('');
        this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValidators([Validators.required]);
      this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).updateValueAndValidity();
        // this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).clearValidators();
         //this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).updateValueAndValidity();
      }
      
      if (!pregunta.mostrarOtroCheckbox) {
        //pregunta.OBLIGATORIO2 = true;
        this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValue('');
        this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).clearValidators();
      this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).updateValueAndValidity();
        console.log('obligatorio')
        // this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).setValue('');
        // this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).updateValueAndValidity();
      
        // const checkboxOtroElement = document.getElementById(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}_${j}`) as HTMLInputElement;     
        // checkboxOtroElement.innerText = '';
        // console.log(checkboxOtroElement)
      // }
     
      // } else {
      //   this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).clearValidators();
      //   this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).updateValueAndValidity();
      }
    
    }
    if (!pregunta.OBLIGATORIO) {
      pregunta.OBLIGATORIO2 = false;
      pregunta.OBLIGATORIO = false;
      return
    }
    pregunta.VALORES = pregunta.VALORES || [];
    if (evento.target.checked) {
      pregunta.VALORES.push(opcionSeleccionada)
    }
    else {
      pregunta.VALORES = pregunta.VALORES.filter(x => x != opcionSeleccionada)
    }

    // Si ninguno está seleccionado, activamos la propiedad required para todos los checkboxes
    if (pregunta.VALORES.length > 0) {
      pregunta.VALOR.split(';').forEach((opcion, index) => {
        // pregunta.OBLIGATORIO2 = false;
        
        // this.form.get(`checkbox_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}_${index}`).clearValidators();
        // this.form.get(`checkbox_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}_${index}`).updateValueAndValidity();
      });
      console.log('if')
      pregunta.OBLIGATORIO2 = false;
    } else {
      // Al seleccionar un checkbox, desactivamos la propiedad required para todos los checkboxes
      pregunta.VALOR.split(';').forEach((opcion, index) => {
        // pregunta.OBLIGATORIO2 = true;
        // this.form.get(`checkbox_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}_${index}`).setValidators([Validators.required]);
        // this.form.get(`checkbox_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}_${index}`).updateValueAndValidity();
        // console.log(this.form.get(`checkbox_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}_${index}`))
      });
      pregunta.OBLIGATORIO2 = true;
      console.log('else')
    }

    console.log(pregunta.OBLIGATORIO2)

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
            // respuesta = valorOtro;
            respuesta = `Otro: ${valorOtro}`;
          }
        }
      } else if (tipo === 'checkbox') {
        pregunta.VALOR.split(';').filter((opcion, i) => {
          const isChecked = this.form.get(`checkbox_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}_${i}`).value;
          if (isChecked) {
            respuesta += (respuesta ? ', ' : '') + opcion;
          }
        });

        if (pregunta.mostrarOtroCheckbox) {
          const valorOtro = this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value;
          if (valorOtro) {
            // respuesta += (respuesta ? ', ' : '') + valorOtro;
            // respuesta += (respuesta ? ', ' : '') + `Otro: ${valorOtro}`;
            respuesta += `: ${valorOtro}`;
          }
        }
      } else if (tipo === 'desplegable') {
        respuesta = this.form.get(`desplegable_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value || '';
      }

      // if (respuesta) {
      const respuestaFormato = {
        FK_ID_MAE_ENCUESTA_PREGUNTA: pregunta.ID_MAE_ENCUESTA_PREGUNTA,
        RESPUESTA: respuesta.toString()
      };
      respuestas.push(respuestaFormato);
      // }
    });

    console.log(respuestas);
    this.ApiService.saveEncuestaRespuesta(respuestas).subscribe((data) => {
      this.mostrarFormulario = false;
      const title = "ENCUESTA COMPLETADA";
      const message = "Se completó la encuesta correctamente"
      this.Message.showModal(title, message);
    });
  }

  alMenosUnaPreguntaRespondida(): boolean {
    return (
      this.datosPreguntaEncuesta &&
      this.datosPreguntaEncuesta.MAE_ENCUESTA_PREGUNTAS &&
      this.datosPreguntaEncuesta.MAE_ENCUESTA_PREGUNTAS.some(pregunta => this.esPreguntaRespondida(pregunta))
    );
  }

  esPreguntaRespondida(pregunta: any): boolean {
    const tipo = pregunta.TIPO;

    if (tipo === 'respuestaCorta') {
      return !!this.form.get(`respuestaCorta_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value;
    } else if (tipo === 'respuestaLarga') {
      return !!this.form.get(`respuestaLarga_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value;
    } else if (tipo === 'radioButton') {
      const valor = this.form.get(`radioButton_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value;
      return !!valor || (pregunta.mostrarOtroRadio && !!this.form.get(`radioButtonOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value);
    } else if (tipo === 'checkbox') {
      return pregunta.VALOR.split(';').some((opcion, i) => {
        return !!this.form.get(`checkbox_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}_${i}`).value;
      }) || (pregunta.mostrarOtroCheckbox && !!this.form.get(`checkboxOtro_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value);
    } else if (tipo === 'desplegable') {
      return !!this.form.get(`desplegable_${pregunta.ID_MAE_ENCUESTA_PREGUNTA}`).value;
    }

    return false;
  }

  isAnyCheckboxSelected(pregunta) {
    console.log(pregunta)
    return pregunta.VALOR.split(';').some(opcion => opcion.trim() !== '');
  }
}