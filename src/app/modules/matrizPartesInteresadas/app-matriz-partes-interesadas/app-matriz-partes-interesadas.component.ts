import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-matriz-partes-interesadas',
  templateUrl: './app-matriz-partes-interesadas.component.html',
  styleUrls: ['./app-matriz-partes-interesadas.component.css']
})
export class AppMatrizPartesInteresadasComponent implements OnInit{
  valoresForm: any[] = [];
  datosUsuario: any = [];
  datos: any = [];
  pst: any;
  logo: any;
  adicionarParteInteresada: boolean = false;
  lastVisible: any;
  selectedOption: string = '';
  option: string = '';
  isEditarActivo: boolean= true;
  generarPDFActivo:boolean=false;
  disableCampos: boolean = false;
  //actualizacion
  estadoCumplimiento: any;
  observaciones: any;
  acciones: any;
  fecha: any;
  responsable: any;
  estado: any;
  interesada:any;
  necesidades:any;
  otro: any;
  expectativas:any;
  PI:any[]=[];
  OG:any[]=[];
  ONG:any[]=[];
  OTRO:any[]=[];
  public form!: FormGroup;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public ApiService: ApiService,
    ){}

  ngOnInit(){
    //this.isEditarActivo= true;
    this.form = this.fb.group({
      estadoCumplimiento: ['',Validators.required],
      observaciones: [''],
      acciones: [''],
      fecha: [''],
      responsable: [''],
      estado: [''],
      interesada:['',Validators.required],
      necesidades:['',Validators.required],
      otro: [""],
      expectativas:["",Validators.required]

    });
    
    this.usuario();
    this.updateForm();

    //this.isEditarActivo= true;
  }

  getTextoPregFormControlName(): string {
    return this.option === 'noCumple' || this.option === 'cumpleParcialmente' ? 'observaciones' : 'necesidades';
  }

  getIdSeleccionado(opcion: string): number {
  switch (opcion) {
    case 'proveedores':
      return 0;
    case 'gubernamentales':
      return 1;
    case 'nogubernamentales':
      return 2;
    case 'otro':
      return 3;
    default:
      return -1; // Valor por defecto en caso de opción inválida
  }
}

  usuario(){
    this.api.getUsuario()
    .subscribe((data: any) => {
      this.datosUsuario = data;
      this.pst = data.NOMBRE_PST;
      this.logo = data.LOGO
    })
  }

  capturarValor(event: Event) {
    const elemento = event.target as HTMLInputElement;
    console.log(elemento,'ele')
    const idInput = elemento.id;
    const valorInput = elemento.value;
    const textoLabel = elemento.previousElementSibling?.textContent;
    const ORDEN ={
      proveedores:0,
      gubernamentales:1,
      nogubernamentales:2,
      otro:3
    }  
    if (textoLabel) {
      const result = this.valoresForm.find((o: any) => o.PREGUNTA === textoLabel);
      if (result) {
        result.RESPUESTA = valorInput;
        result.ORDEN = ORDEN[this.form.get('interesada').value];
        result.ID_RESPUESTA_FORMULARIOS= idInput ? parseInt(idInput) : 0;
      } else {
        this.valoresForm.push({
          ID_RESPUESTA_FORMULARIOS: idInput ? parseInt(idInput) : 0,
          FK_MAE_FORMULARIOS: 2,
          PREGUNTA: textoLabel,
          ORDEN: ORDEN[this.form.get('interesada').value],
          RESPUESTA: valorInput,
          FK_USUARIO: localStorage.getItem('Id')
        });
      }
    }
  }
  
  disabledInput(){
    this.form.get('interesada').disable();
    this.form.get('otro').disable();
    this.form.get('necesidades').disable();
    this.form.get('expectativas').disable();
    this.form.get('estadoCumplimiento').disable();
    this.form.get('observaciones').disable();
    this.form.get('acciones').disable();
    this.form.get('fecha').disable();
    this.form.get('responsable').disable();
    this.form.get('estado').disable();
  }

  saveForm() {
    //debugger;
  this.ApiService.saveForms(this.valoresForm)
  .subscribe((data: any) => {
    console.log(data,"Carga exitosa");
    this.isEditarActivo = false;
    this.generarPDFActivo = true; 
    
    //Restablecer la validación del campo "otro" si no se selecciona la opción "otro"
  if (this.selectedOption !== 'otro') {
    this.form.get('otro4')?.clearValidators();
    this.form.get('otro4')?.updateValueAndValidity();
  }
  this.disabledInput();
  })
 
  }
  
 
/*   mostrarForm(){
    this.adicionarParteInteresada = true;
  }
 */
  onSelect(value: string) {
    this.selectedOption = value;
  
    if (value === 'otro') {
      this.form.get('otro')?.setValidators([Validators.required]);
      this.form.get('otro')?.updateValueAndValidity();
  
      const mostrar = document.querySelector('#otro') as HTMLInputElement;
      mostrar.style.display = 'block';
  
      // Deshabilitar el botón de editar cuando se selecciona "otro"
      //this.isEditarActivo = true;
    } else {
      this.form.get('otro')?.clearValidators();
      this.form.get('otro')?.updateValueAndValidity();

      if(this.PI.length > 0 && this.form.get('interesada').value === 'proveedores'){
        this.form.get('necesidades').setValue(this.PI[1].RESPUESTA);
        this.form.get('expectativas').setValue(this.PI[2].RESPUESTA);
        this.form.get('estadoCumplimiento').setValue(this.PI[3].RESPUESTA);
       
      }else{
        this.form.get('necesidades').setValue('');
        this.form.get('expectativas').setValue('');
        this.form.get('estadoCumplimiento').setValue('');
      }
     

      const ocultar = document.querySelector('#otro') as HTMLInputElement;
      ocultar.style.display = 'none';

    
  
      // Habilitar el botón de editar para otras opciones seleccionadas
      //this.isEditarActivo = false;
    }
  //  return this.capturarValor(event);
  }

  optionSelected(value: string){
    this.option = value;
    if(value!=='cumple'){
      this.form.get('observaciones')?.setValidators([Validators.required]);
      this.form.get('observaciones')?.updateValueAndValidity();
      this.form.get('acciones')?.setValidators([Validators.required]);
      this.form.get('acciones')?.updateValueAndValidity();
      this.form.get('fecha')?.setValidators([Validators.required]);
      this.form.get('fecha')?.updateValueAndValidity();
      this.form.get('responsable')?.setValidators([Validators.required]);
      this.form.get('responsable')?.updateValueAndValidity();
      this.form.get('estado')?.setValidators([Validators.required]);
      this.form.get('estado')?.updateValueAndValidity();


    }else{
      this.form.get('observaciones')?.clearValidators();
      this.form.get('observaciones')?.updateValueAndValidity();
      this.form.get('acciones')?.clearValidators();
      this.form.get('acciones')?.updateValueAndValidity();
      this.form.get('fecha')?.clearValidators();
      this.form.get('fecha')?.updateValueAndValidity();
      this.form.get('responsable')?.clearValidators();
      this.form.get('responsable')?.updateValueAndValidity();
      this.form.get('estado')?.clearValidators();
      this.form.get('estado')?.updateValueAndValidity();
    }
  }

  activarCampos(){
    //Habilitar los campos después de guardar
  this.form.get('interesada').enable();
  this.form.get('otro').enable();
  this.form.get('interesada').enable();
  this.form.get('necesidades').enable();
  this.form.get('expectativas').enable();
  this.form.get('estadoCumplimiento').enable();
  this.form.get('observaciones').enable();
  this.form.get('acciones').enable();
  this.form.get('fecha').enable();
  this.form.get('responsable').enable();
  this.form.get('estado').enable();
}

 generatePDF(){
  this.updateForm();
  const getSelected = this.form.get('interesada')?.value;
  const ordenVariables = {
   'proveedores':0,
   'gubernamentales':1,
   "nogubernamentales":2,
   "otro":3,
  };
  const filterData = this.datos.filter(e=>e.ORDEN===ordenVariables[getSelected]);
  console.log(filterData,'data filtrada',this.datos,'datos');
    const pdfDefinition: any = {
      header: {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [     
              { image: this.logo, fit:[50, 50], alignment: 'center', margin:[ 0,3, 0,3 ], rowSpan: 2 },
              { text: this.pst, alignment: 'center', margin:[ 0, 21, 0, 21 ], rowSpan: 2},
              { text: 'PARTES INTERESADAS', alignment: 'center',rowSpan: 2, margin:[ 0,9,0,9 ] },
              { text: 'CÓDIGO:', alignment: 'center' }
            ],
            [
              {},
              {},
              '',
              { text: 'VERSIÓN:', alignment: 'center', margin:[ 0, 12, 0, 12 ] },
            ]
          ]
        },
        margin:[ 45, 8, 45, 8 ],
        fontSize: 11,
      },
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageOrientation: 'landscape',
      pageMargins: [ 45, 80, 45, 80 ],
      content: [
      {        
        table: {
          widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto','auto'],
          body: [
            [     
              { text: 'PARTE INTERESADA PERTENECIENTE AL SGS', style: ['tituloTabla'], margin:[ 0, 46, 0, 46 ] },
              { text: 'NECESIDAD(ES) DE LA PARTE INTERESADA', style: ['tituloTabla'], margin:[ 0, 45, 0, 45 ] },
              { text: 'EXPECTATIVA(S) DE LA PARTE INTERESADA', style: ['tituloTabla'], margin:[ 0, 45, 0, 45 ] },
              { text: 'LA ORGANIZACIÓN CUMPLE CON LOS REQUISITOS DE LAS PARTES INTERESADAS (C/ NC / CP)', style: ['tituloTabla'], margin:[ 0, 15, 0, 15 ] },
              { text: 'OBSERVACIONES - Aplica para cumplimiento parcial (CP) y NO Cumple (NC) de los requisitos de las partes interesadas', style: ['tituloTabla'], margin:[ 0, 13, 0, 13 ] },
              { text: 'ACCIONES A REALIZAR - Aplica para cumplimiento parcial (CP) y NO Cumple (NC) de los requisitos de las partes interesadas', style: ['tituloTabla'] },
              { text: 'FECHA PARA LA EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 45, 0, 45 ] },
              { text: 'RESPONSABLE DE EJECUCIÓN', style: ['tituloTabla'], margin:[ 0, 55, 0, 55 ] },
              { text: 'FECHA DE SEGUIMIENTO', style: ['tituloTabla'], margin:[ 0, 55, 0, 55 ] },
              { text: 'ESTADO / OBSERVACIÓN ABIERTA / CERRADA', style: ['tituloTabla'], margin:[ 0, 35, 0, 35 ] },
            ],
            [
              { text: 'PROVEEDOR(ES)', style: ['tituloTabla'] },
              { text:filterData.filter(e=>e.ORDEN ===0).length > 0 && filterData[1]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===0).length > 0 && filterData[2]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===0).length > 0 &&  filterData[3]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===0).length > 0 &&  filterData[4]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===0).length > 0 &&  filterData[5]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===0).length > 0 &&  filterData[6]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===0).length > 0 &&  filterData[7]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===0).length > 0 && filterData[8]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===0).length > 0 && filterData[9]?.RESPUESTA||'-'},
            ],
            [
              { text: 'ORGANIZACIONES GUBERNAMENTALES', style: ['tituloTabla'] },
              { text:filterData.filter(e=>e.ORDEN ===1).length > 0 && filterData[1]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===1).length > 0 && filterData[2]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===1).length > 0 &&  filterData[3]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===1).length > 0 &&  filterData[4]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===1).length > 0 &&  filterData[5]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===1).length > 0 &&  filterData[6]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===1).length > 0 &&  filterData[7]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===1).length > 0 && filterData[8]?.RESPUESTA||'-'},
              { text:filterData.filter(e=>e.ORDEN ===1).length > 0 && filterData[9]?.RESPUESTA||'-'},
            ],
            [
              { text: 'ORGANIZACIONES NO GUBERNAMENTALES', style: ['tituloTabla'] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: 'CLIENTE(S)', style: ['tituloTabla'] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: 'HUÉSPEDES', style: ['tituloTabla'] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: 'COLABORADORES (Personal directo y/o indirecto)', style: ['tituloTabla'] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: 'ACCIONISTAS O PROPIETARIOS', style: ['tituloTabla'] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: 'COMUNIDAD ', style: ['tituloTabla'] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: 'COMUNIDAD VULNERABLE', style: ['tituloTabla'] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: 'ATRACTIVOS TURÍSTICOS', style: ['tituloTabla'] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: 'OTRA, ¿CUÁL?', style: ['tituloTabla'] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ]
          ],
        },
      }
      ],
      styles: {
        tituloTabla:{
          fontSize: 13,
          bold: true,
          alignment: 'center',
          fillColor: '#dddddd',
        }
      }
    }
    pdfMake.createPdf(pdfDefinition).download('Matriz_partes_interesadas.pdf');
    // Limpiar el formulario después de generar el PDF
    this.generarPDFActivo = false; 
    //this.form.reset();
  }

  updateForm() {
    //debugger;
    this.api.getFormsParteInteresada()
      .subscribe((data: any) => {
        this.datos = data.RESPUESTAS ;
        console.log(data, "data")
        const ordenVariables = {
          0: this.PI,
          1: this.OG,
          2: this.ONG,
          3: this.OTRO,
        };
        const ordenPregunta = {
          'Seleccione parte interesada': 'interesada',
          'Necesidades de la parte interesada':'necesidades',
          'Expectativas de la parte interesada': 'expectativas',
          'Estado de cumplimiento': 'estadoCumplimiento'
        };
        data.RESPUESTAS.forEach((respuesta: any) => {
          const pregunta = respuesta.PREGUNTA;
          const valorRespuesta = respuesta.RESPUESTA;
          
          // Obtener la variable correspondiente según el valor de 'orden'
          const variable = ordenVariables[respuesta.ORDEN];
  
          // Si la variable existe, guardar la respuesta en el formulario
          if (variable) {
            this.form.get(ordenPregunta[pregunta])?.patchValue(valorRespuesta);
            this.disabledInput();
            this.isEditarActivo = false;
          }

          if (variable) {
            console.log(ordenPregunta[pregunta],'idahora')
            // Precargar el valor de idformulario en el input o select del HTML si está disponible
            const inputElement = document.getElementById(ordenPregunta[pregunta]);
            console.log(ordenPregunta[pregunta],'ideste')
            if (inputElement instanceof HTMLInputElement) {
              inputElement.value = valorRespuesta;
            } else if (inputElement instanceof HTMLSelectElement) {
              inputElement.value = valorRespuesta;
            }
          }
        });

        
        

  //Crear un array con las variables y sus longitudes para simplificar las condiciones
  const variables = [
   { variable: this.PI, length: 4 },
   { variable: this.OG, length: 4 },
   { variable: this.ONG, length: 4 },
   { variable: this.OTRO, length: 4 },
  ];

  //Encontrar la primera variable que cumpla con la condición
  const varResp = variables.find((item) => item.variable.length > 0 && item.variable.length === item.length);

 //Función para configurar los campos de respuesta en el formulario
  const setRespuestas = (respuestaArray) => {
  const camposRespuestas = ['interesada', 'necesidades', 'expectativas', 'estadoCumplimiento'];

 //Si la opción seleccionada en 'interesada' es 'otro', agregar el campo adicional
  if (respuestaArray[0].RESPUESTA === 'otro') {
    camposRespuestas.push('otro');
  }

 //Si el estado de cumplimiento es 'noCumple' o 'cumpleParcialmente', agregar campos adicionales
  if (respuestaArray[3].RESPUESTA === 'noCumple' || respuestaArray[3].RESPUESTA === 'cumpleParcialmente') {
    camposRespuestas.push('observaciones', 'acciones', 'fecha', 'responsable', 'estado');
  }

 //Establecer los valores en el formulario según los campos de respuesta configurados

 camposRespuestas.forEach((campo, index) => {
    this.form.get(campo).setValue(respuestaArray[index].RESPUESTA);
  });
};

// Si se encontró una variable con el registro deseado, cargar los campos
if (varResp) {
  const varRespData = varResp.variable; // Obtener los datos de la variable encontrada

  // Si tiene 9 o 10 respuestas, configurar los campos correspondientes en el formulario
  if (varRespData.length === 9 || varRespData.length === 10) {
    setRespuestas(varRespData);

    this.isEditarActivo = false;
    this.disabledInput();
  }
}


        // if (data && data.length > 0) {
        //   //Activar boton de editar
        //    this.isEditarActivo = false
        //   // this.datos = data;
        //   // precargar valor del select


        //   // Verificar si las respuestas existen y asignar los valores al formulario
        //   // const respuestaInteresada = this.datos.find(respuesta => respuesta.PREGUNTA === 'Seleccione parte interesada');
        //   // const respuestaNecesidades = this.datos.find(respuesta => respuesta.PREGUNTA === 'Necesidades de la parte interesada');
        //   // const respuestaExpectativas = this.datos.find(respuesta => respuesta.PREGUNTA === 'Expectativas de la parte interesada');
        //   // const respuestaEstadoCumplimiento = this.datos.find(respuesta => respuesta.PREGUNTA === 'Estado de cumplimiento');
        //   // const respuestaObservaciones = this.datos.find(respuesta => respuesta.PREGUNTA === 'Observaciones');
        //   // const respuestaAccion = this.datos.find(respuesta => respuesta.PREGUNTA === 'Acciones a realizar');
        //   // const respuestaFecha = this.datos.find(respuesta => respuesta.PREGUNTA === 'Fecha para la ejecución');
        //   // const respuestaResponsable = this.datos.find(respuesta => respuesta.PREGUNTA === '');
        //   // const respuestaEstado = this.datos.find(respuesta => respuesta.PREGUNTA === '');

        //   // if (respuestaInteresada) {
        //   //   this.form.get('interesada').setValue(respuestaInteresada.RESPUESTA);
        //   //   if (respuestaInteresada.RESPUESTA === 'proveedores' || 'gubernamentales' || 'nogubernamentales' || 'otro') {
        //   //     this.interesada = respuestaInteresada.RESPUESTA;
        //   //   } else if (respuestaInteresada.RESPUESTA === 'anual') {
        //   //     this.interesada = 'una vez al año';
        //   //   }
        //   // }
        //   // if (respuestaNecesidades) {
        //   //   this.form.get('necesidades').setValue(respuestaNecesidades.RESPUESTA);
        //   //   if (respuestaNecesidades.RESPUESTA === 'prueba') {
        //   //     this.necesidades = 'prueba';
        //   //   } else if (respuestaNecesidades.RESPUESTA === 'prueba') {
        //   //     this.necesidades = 'prueba';
        //   //   }
        //   // }
        //   // Deshabilitar los campos después de guardar
        //   // this.form.get('interesada').disable();
        //   // this.form.get('otro').disable();
        //   // this.form.get('necesidades').disable();
        //   // this.form.get('expectativas').disable();
        //   // this.form.get('estadoCumplimiento').disable();
        //   // this.form.get('observaciones').disable();
        //   // this.form.get('acciones').disable();
        //   // this.form.get('fecha').disable();
        //   // this.form.get('responsable').disable();
        //   // this.form.get('estado').disable();
        // }
      })
    }
}
