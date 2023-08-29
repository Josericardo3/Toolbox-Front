import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { differenceBy } from 'lodash';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ObjectUnsubscribedError } from 'rxjs';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-matriz-partes-interesadas',
  templateUrl: './app-matriz-partes-interesadas.component.html',
  styleUrls: ['./app-matriz-partes-interesadas.component.css']
})
export class AppMatrizPartesInteresadasComponent implements OnInit {
  valoresForm: any[] = [];
  datosUsuario: any = [];
  datos: any = [];
  pst: any;
  logo: any;
  adicionarParteInteresada: boolean = false;
  lastVisible: any;
  selectedOption: string = '';
  option: string = '';
  isEditarActivo: boolean = true;
  generarPDFActivo: boolean = false;
  disableCampos: boolean = false;
  //actualizacion
  estadoCumplimiento: any;
  observaciones: any;
  acciones: any;
  fecha: any;
  responsable: any;
  estado: any;
  interesada: any;
  necesidades: any;
  otro: any;
  expectativas: any;
  PI: any[] = [];
  OG: any[] = [];
  ONG: any[] = [];
  OTRO: any[] = [];
  otrocual: boolean = false;
  datafinal: any;
  public form!: FormGroup;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public ApiService: ApiService,
  ) { }

  ngOnInit() {
    //this.isEditarActivo= true;
    this.form = this.fb.group({
      estadoCumplimiento: ['', Validators.required],
      observaciones: [''],
      acciones: [''],
      fecha: [''],
      responsable: [''],
      estado: [''],
      interesada: ['', Validators.required],
      necesidades: ['', Validators.required],
      otro: [""],
      expectativas: ["", Validators.required]

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
        return 1;
      case 'gubernamentales':
        return 2;
      case 'nogubernamentales':
        return 3;
      case 'otro':
        return 4;
      default:
        return -1; // Valor por defecto en caso de opción inválida
    }
  }

  usuario() {
    this.api.getUsuario()
      .subscribe((data: any) => {
        this.datosUsuario = data;
        this.pst = data.NOMBRE_PST;
        this.logo = data.LOGO
      })
  }
  
  inputreset() {
    this.form.get('otro')?.updateValueAndValidity();
  }


  capturarValor(event: Event, formControllerName:string) {
    const elemento = event.target as HTMLInputElement;
    const idInput = elemento.id;
    const valorInput = elemento.value;
    const textoLabel = elemento.previousElementSibling?.textContent;
    const ORDEN = {
      proveedores: 1,
      gubernamentales: 2,
      nogubernamentales: 3,
      otro: 4
    }


    if (textoLabel) {
      const result = this.valoresForm.find((o: any) => o.PREGUNTA === formControllerName);
      var objDataFinal = this.datafinal.find((o:any)=> o.PREGUNTA === formControllerName);
    
      var idRespuesta = 0;
      if(objDataFinal){
        idRespuesta = objDataFinal.ID_RESPUESTA_FORMULARIOS;
      }
      if (result) {
        result.RESPUESTA = valorInput;
        result.ORDEN = ORDEN[this.form.get('interesada').value];
        result.ID_RESPUESTA_FORMULARIOS = idRespuesta || 0 ;
      } else {
        this.valoresForm.push({
          ID_RESPUESTA_FORMULARIOS: idRespuesta || 0 ,
          FK_MAE_FORMULARIOS: 2,
          PREGUNTA:formControllerName,
          ORDEN: ORDEN[this.form.get('interesada').value],
          RESPUESTA: valorInput,
          FK_USUARIO: localStorage.getItem('Id')
        });
      }
    }
  }

  disabledInput() {
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

  capturarTodosLosValores() {
  
    const ORDEN = {
      proveedores: 1,
      gubernamentales: 2,
      nogubernamentales: 3,
      otro: 4
    };

    const camposFiltrados = [
      'interesada',
      'necesidades',
      'expectativas',
      'estadoCumplimiento',
      'otro',
      'observaciones',
      'acciones',
      'fecha',
      'responsable',
      'estado',
    ];

    camposFiltrados.forEach((campo) => {
      const textoLabel = campo;
      if (textoLabel) {
        let result = this.valoresForm.find((o: any) => o.PREGUNTA === campo);
        if(this.datafinal){
          var objDataFinal = this.datafinal.find((o:any)=> o.PREGUNTA === campo);
        }
        else{
          var objDataFinal = this.valoresForm.find((o:any)=> o.PREGUNTA === campo);

        }
        var id;
        if(objDataFinal){
          
           id  = objDataFinal.ID_RESPUESTA_FORMULARIOS || 0;
        }
      
        if (result) {
          result.RESPUESTA = this.form.get(campo)?.value || ''; // Si está vacío, enviar como cadena vacía
          result.ORDEN = ORDEN[this.form.get('interesada').value];
          result.ID_RESPUESTA_FORMULARIOS = id || 0;
          
        } else {
          result = {
            ID_RESPUESTA_FORMULARIOS: id || 0,
            FK_MAE_FORMULARIOS: 2,
            PREGUNTA: campo,
            ORDEN: ORDEN[this.form.get('interesada').value],
            RESPUESTA: this.form.get(campo)?.value || '', // Si está vacío, enviar como cadena vacía
            FK_USUARIO: localStorage.getItem('Id')
          };
          this.valoresForm.push(result);
        }
      }
    });
   
  }

  saveForm() {
    this.capturarTodosLosValores();
   
    this.ApiService.saveForms(this.valoresForm)
      .subscribe((data: any) => {
   
        this.isEditarActivo = false;
        this.generarPDFActivo = true;

        //Restablecer la validación del campo "otro" si no se selecciona la opción "otro"
        if (this.selectedOption !== 'otro') {
          this.form.get('otro')?.clearValidators();
          this.form.get('otro')?.updateValueAndValidity();
        }
        this.disabledInput();
      })

  }

  onSelect(value: string) {
    this.selectedOption = value;

    const ordenVariables = {
      'proveedores': 1,
      'gubernamentales': 2,
      "nogubernamentales": 3,
      "otro": 4,
    };

    var filterData = this.datos.filter(e => e.ORDEN === ordenVariables[value]);
    this.form.get('observaciones')?.setValue('');
    this.form.get('acciones')?.setValue('');
    this.form.get('fecha')?.setValue('');
    this.form.get('responsable')?.setValue('');
    this.form.get('estado')?.setValue('');

    if (value === 'otro' && filterData.length === 0) {
      this.form.get('necesidades').setValue('');
      this.form.get('expectativas').setValue('');
      this.form.get('estadoCumplimiento').setValue('');
      this.form.get('otro')?.setValidators([Validators.required]);
      this.form.get('otro')?.updateValueAndValidity();
      const mostrar = document.querySelector('#otro') as HTMLInputElement;
      if(mostrar!= null){
        mostrar.style.display = 'block';
      }

      // Deshabilitar el botón de editar cuando se selecciona "otro"
      //this.isEditarActivo = true;
    } else if (filterData.length === 0) {
      this.form.get('otro')?.clearValidators();
      this.form.get('otro')?.updateValueAndValidity();

      if (this.PI.length > 0 && this.form.get('interesada').value === 'proveedores') {
        this.form.get('necesidades').setValue(this.PI[1].RESPUESTA);
        this.form.get('expectativas').setValue(this.PI[2].RESPUESTA);
        this.form.get('estadoCumplimiento').setValue(this.PI[3].RESPUESTA);

      } else {
        this.form.get('necesidades').setValue('');
        this.form.get('expectativas').setValue('');
        this.form.get('estadoCumplimiento').setValue('');
      }
      const ocultar = document.querySelector('#otro') as HTMLInputElement;
      if(ocultar!= null){
        ocultar.style.display = 'none';
      }
      // Habilitar el botón de editar para otras opciones seleccionadas
     // this.isEditarActivo = false;
    }

    // precargar los dato cuando existen en el servicio

    //this.fnFillData(this.datos);

  }

  optionSelected(value: string) {
    this.option = value;
    if (value !== 'cumple') {
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
    } else {
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

  activarCampos() {
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
    this.isEditarActivo=true;
  }

  updateForm() {
    this.api.getFormsParteInteresada()
      .subscribe((data: any) => {
        this.datos = data.RESPUESTA_GRILLA;
        if(this.datos.length!= 0){
          const obj = this.datos.filter((item) => item.PREGUNTA === "estadoCumplimiento");
          this.option= obj[0].RESPUESTA;
        }
        this.optionSelected(this.option);
        this.fnFillData(data.RESPUESTA_GRILLA);
      })
  }
  ID_RESPUESTA_FORMULARIOS: number;


  fnFillData(data: any) {
    const ordenVariables = {
      'proveedores': 1,
      'gubernamentales': 2,
      'nogubernamentales': 3,
      'otro': 4,
    };
  
    // Obtener el valor de 'interesada' desde this.datos
    const getSelectedData = this.datos.find((item) => item.PREGUNTA === 'interesada');
    const getSelected = getSelectedData ? getSelectedData.RESPUESTA : 'proveedores'; // Valor predeterminado 'proveedores' si no se encuentra 'interesada' en this.datos

    const ordenPregunta = [
      'interesada',
      'necesidades',
      'expectativas',
      'estadoCumplimiento',
      'otro',
      'observaciones',
      'acciones',
      'fecha',
      'responsable',
      'estado',
    ];
  
    const formFields = {}; // Create an object to store form field names and their values
    // Inicializar formFields con valores vacíos
    ordenPregunta.forEach((pregunta) => {
      const fieldValue = this.form.get(pregunta)?.value || '';
      formFields[pregunta] = fieldValue; // Save the form field name and its value
    });

    // Filtrar los campos por el valor seleccionado en this.datos
    const filterData = this.datos.filter((item) => item.ORDEN === ordenVariables[getSelected]);
  
    data.forEach((respuesta: any) => {
      const pregunta = respuesta.PREGUNTA;
      const valorRespuesta = respuesta.RESPUESTA;
      const variable = ordenVariables[respuesta.ORDEN];
    
      if (variable) {
        const fieldName = ordenPregunta[pregunta];
        const valueToSet = typeof valorRespuesta === 'number' ? valorRespuesta : parseInt(valorRespuesta, 10);
        this.form.get(fieldName)?.patchValue(valueToSet); // Usamos patchValue para asignar el valor al campo del formulario
      }
    });
   

    this.datafinal = this.datos;
    // Configurar los campos del formulario con los valores finales
    
    filterData.forEach((fieldName, value) => {
      this.ID_RESPUESTA_FORMULARIOS = fieldName.ID_RESPUESTA_FORMULARIOS;
     
      this.form.get(fieldName.PREGUNTA)?.patchValue(fieldName.RESPUESTA);
  
      const inputElement = document.getElementById(fieldName);
      if (inputElement instanceof HTMLInputElement || inputElement instanceof HTMLSelectElement) {
        inputElement.value = value.toString(); // Cast 'value' to string explicitly
      }
    });
   if(filterData.length > 0){
    this.generarPDFActivo = true;
    this.isEditarActivo = false;
    this.disabledInput()
   }else{
    this.isEditarActivo = true;
   }
  }
  
  generatePDF() {
    this.updateForm();
    const getSelected = this.form.get('interesada')?.value;
    const ordenVariables = {
      'proveedores': 1,
      'gubernamentales': 2,
      "nogubernamentales": 3,
      "otro": 4,
    };
    const ordenPregunta = [
      'interesada',
      'necesidades',
      'expectativas',
      'estadoCumplimiento',
      'otro',
      'observaciones',
      'acciones',
      'fecha',
      'responsable',
      'estado',
    ];
  
    var data;
    if(this.valoresForm.length!=0){
      data = this.valoresForm;
    }else{
      data = this.datos;

    }
    const formFields = {}; // Create an object to store form field names and their values
    // Inicializar formFields con valores vacíos
 
    
    var filterData =[];
    const filterData2 = data.filter(e => e.ORDEN === ordenVariables[getSelected]);
    ordenPregunta.forEach((pregunta) => {
      const dato = filterData2.filter(e => e.PREGUNTA === pregunta);
      if (dato.length > 0) {
        filterData.push(dato[0]); // Agregamos el primer elemento de 'dato' a 'filterData'
      }
    });

    const pdfDefinition: any = {
      header: {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
              { image: this.logo, fit: [50, 50], alignment: 'center', margin: [0, 3, 0, 3], rowSpan: 2 },
              { text: this.pst, alignment: 'center', margin: [0, 21, 0, 21], rowSpan: 2 },
              { text: 'PARTES INTERESADAS', alignment: 'center', rowSpan: 2, margin: [0, 9, 0, 9] },
              { text: 'CÓDIGO:', alignment: 'center' }
            ],
            [
              {},
              {},
              '',
              { text: 'VERSIÓN:', alignment: 'center', margin: [0, 12, 0, 12] },
            ]
          ]
        },
        margin: [45, 8, 45, 8],
        fontSize: 11,
      },
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageOrientation: 'landscape',
      pageMargins: [45, 80, 45, 80],
      content: [
        {
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'PARTE INTERESADA PERTENECIENTE AL SGS', style: ['tituloTabla'], margin: [0, 46, 0, 46] },
                { text: 'NECESIDAD(ES) DE LA PARTE INTERESADA', style: ['tituloTabla'], margin: [0, 45, 0, 45] },
                { text: 'EXPECTATIVA(S) DE LA PARTE INTERESADA', style: ['tituloTabla'], margin: [0, 45, 0, 45] },
                { text: 'LA ORGANIZACIÓN CUMPLE CON LOS REQUISITOS DE LAS PARTES INTERESADAS (C/ NC / CP)', style: ['tituloTabla'], margin: [0, 15, 0, 15] },
                { text: 'OBSERVACIONES', style: ['tituloTabla'], margin: [0, 13, 0, 13] },
                { text: 'ACCIONES A REALIZAR', style: ['tituloTabla'] },
                { text: 'FECHA PARA LA EJECUCIÓN', style: ['tituloTabla'], margin: [0, 45, 0, 45] },
                { text: 'RESPONSABLE DE EJECUCIÓN', style: ['tituloTabla'], margin: [0, 55, 0, 55] },
                { text: 'FECHA DE SEGUIMIENTO', style: ['tituloTabla'], margin: [0, 55, 0, 55] },
                { text: 'ESTADO / OBSERVACIÓN ABIERTA / CERRADA', style: ['tituloTabla'], margin: [0, 35, 0, 35] },
              ],
              [
                { text: 'PROVEEDOR(ES)', style: ['tituloTabla'] },
                { text: filterData.filter(e => e.ORDEN === 1).length > 0 && filterData[1]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 1).length > 0 && filterData[2]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 1).length > 0 && filterData[3]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 1).length > 0 && filterData[5]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 1).length > 0 && filterData[6]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 1).length > 0 && filterData[7]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 1).length > 0 && filterData[8]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 1).length > 0 && filterData[8]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 1).length > 0 && filterData[9]?.RESPUESTA || '-' },
              ],
              [
                { text: 'ORGANIZACIONES GUBERNAMENTALES', style: ['tituloTabla'] },
                { text: filterData.filter(e => e.ORDEN === 2).length > 0 && filterData[1]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 2).length > 0 && filterData[2]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 2).length > 0 && filterData[3]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 2).length > 0 && filterData[5]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 2).length > 0 && filterData[6]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 2).length > 0 && filterData[7]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 2).length > 0 && filterData[8]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 2).length > 0 && filterData[8]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 2).length > 0 && filterData[9]?.RESPUESTA || '-' },
              ],
              [
                { text: 'ORGANIZACIONES NO GUBERNAMENTALES', style: ['tituloTabla'] },
                { text: filterData.filter(e => e.ORDEN === 3).length > 0 && filterData[1]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 3).length > 0 && filterData[2]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 3).length > 0 && filterData[3]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 3).length > 0 && filterData[5]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 3).length > 0 && filterData[6]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 3).length > 0 && filterData[7]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 3).length > 0 && filterData[8]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 3).length > 0 && filterData[8]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 3).length > 0 && filterData[9]?.RESPUESTA || '-' },
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
                { 
                  text: `OTRA, ¿CUÁL? : ${filterData.filter(e => e.ORDEN === 4).length > 0 ? filterData[4]?.RESPUESTA : '-'}`,
                  style: ['tituloTabla']
                },
                { text: filterData.filter(e => e.ORDEN === 4).length > 0 && filterData[1]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 4).length > 0 && filterData[2]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 4).length > 0 && filterData[3]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 4).length > 0 && filterData[5]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 4).length > 0 && filterData[6]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 4).length > 0 && filterData[7]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 4).length > 0 && filterData[8]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 4).length > 0 && filterData[8]?.RESPUESTA || '-' },
                { text: filterData.filter(e => e.ORDEN === 4).length > 0 && filterData[9]?.RESPUESTA || '-' },
              ]
            ],
          },
        }
      ],
      styles: {
        tituloTabla: {
          fontSize: 13,
          bold: true,
          alignment: 'center',
          fillColor: '#dddddd',
        }
      }
    }
    pdfMake.createPdf(pdfDefinition).download('Matriz_partes_interesadas.pdf');
    // Limpiar el formulario después de generar el PDF
    this.generarPDFActivo = true;
    //this.form.reset();
  }
}
