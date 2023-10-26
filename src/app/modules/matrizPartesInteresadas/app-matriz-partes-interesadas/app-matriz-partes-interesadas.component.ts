import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { differenceBy } from 'lodash';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ObjectUnsubscribedError } from 'rxjs';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { ApiService } from 'src/app/servicios/api/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { debug } from 'util';

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
  rolessArray: any = [];
  dataInitial: any = [];
  totalPaginas: number = 0;
  datatotal: number = 0;
  contentArray: any = [];
  currentPage: number = 1;
  totalRegistros: number = 0;
  caracteristicaIndice: number;
  pages = 1;
  filter: string = '';
  showfilter: boolean = false;
  result: boolean = false;
  //
  ParteInteresada: string;
  Necesidad: string;
  Expectativa: string;
  Cumplimiento: string;
  Observaciones: string;
  Acciones: string;
  Fecha: string;
  Responsable: string;
  Estado: string;
  selectedResponsable: string='';
  editarCaracteristica: any = {};
  indiceAEliminar: number = -1;
  isChecked: boolean = false;
  mejoraContinua: number;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public ApiService: ApiService,
    private cd: ChangeDetectorRef,
    private Message: ModalService,
  ) { }

  ngOnInit() {
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

    this.fnListResponsible();
    this.usuario();
    this.fnConsultMatrizPartesInteresadas();
    this.isEditarActivo = true;
    this.generarPDFActivo = true;
  }
  fnChangeEditarStatus(val: boolean) {
    this.isEditarActivo = val;
  }
  fnConsultMatrizPartesInteresadas() {
    this.ApiService.getDataParteInteresada().subscribe((data) => {
      this.rolessArray = data;
      this.dataInitial = data;
      //paginado
      const totalPag = data.length;
      this.totalPaginas = Math.ceil(totalPag / 7);
      if (this.totalPaginas == 0) this.totalPaginas = 1;

      this.datatotal = this.dataInitial.length;
      this.rolessArray = this.dataInitial.slice(0, 7);
      this.contentArray = data;
      this.currentPage = 1
      if (this.datatotal >= 7) {
        this.totalRegistros = 7;
      } else {
        this.totalRegistros = this.dataInitial.length;
      }
    })
  }
  fnActivityEditarCancelar() {
    this.caracteristicaIndice = -1;
  }

  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;

    if (this.filter.trim() !== '') {
      this.datatotal = this.contentArray.length;
      this.rolessArray = this.contentArray.slice(startItem, endItem)
    } else {
      this.datatotal = this.dataInitial.length;
      this.rolessArray = this.dataInitial.slice(startItem, endItem)
    }
    this.totalRegistros = this.rolessArray.length;
    this.cd.detectChanges();
  }

  usuario() {
    this.api.getUsuario()
      .subscribe((data: any) => {
        this.datosUsuario = data;
        this.pst = data.NOMBRE_PST;
        this.logo = data.LOGO
      })
  }

  fnListResponsible() {
    const idPerfil = this.getRolValue();
    if (idPerfil == 3) {
      this.ApiService.getPSTSelect().subscribe((data) => {
        this.responsable = data;

      })
    } else {
      this.ApiService.getListResponsible().subscribe((data) => {
        this.responsable = data;

      })
    }
  }

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }
  fnEliminarRegistro(indice: number) {
    this.indiceAEliminar = this.rolessArray[indice].ID_MATRIZ_PARTES_INTERESADAS;
    this.ApiService.deleteMatrizPartesInteresadas(this.indiceAEliminar).subscribe((data:any) => {
      const title = "Eliminación exitosa";
      const message = "El registro se ha eliminado exitosamente";
      this.Message.showModal(title, message);
      this.fnConsultMatrizPartesInteresadas();
    })
  }
  //AGREGAR PARTE INTERESADA
  fnMatrizPartesInteresadasEdit(indice: number) {
    this.caracteristicaIndice = indice;
    this.editarCaracteristica = {};
    this.isChecked = true;
    Object.assign(this.editarCaracteristica, this.rolessArray[indice]);
    this.fnChangeEditarStatus(false);
    this.form.get('interesada').disable();
    this.option = this.editarCaracteristica.ESTADO_DE_CUMPLIMIENTO;
  }
  checkboxChange(event: any) {
    // Actualizamos el valor del checkbox con la opción y el estado
    const checkboxState = event.target.checked;
    if (checkboxState == true)
      this.isChecked = true;
    else
      this.isChecked = false;
  }
  limpiarCampos() {
    this.form.get('interesada')?.setValue('');
    this.form.get('necesidades')?.setValue('');
    this.form.get('expectativas')?.setValue('');
    this.form.get('estadoCumplimiento')?.setValue('');
    this.form.get('observaciones')?.setValue('');
    this.form.get('acciones')?.setValue('');
    this.form.get('fecha')?.setValue('');
    this.form.get('responsable')?.setValue('');
    this.form.get('estado')?.setValue('');
    this.form.get('interesada').enable();
    this.fnChangeEditarStatus(true);
    this.editarCaracteristica.MEJORA_CONTINUA = 0;
    this.isChecked = false;
  }
  fnUpdatePartesInteresadas() {
    this.editarCaracteristica.NECESIDAD = this.form.get('necesidades').value;
    this.editarCaracteristica.EXPECTATIVA = this.form.get('expectativas').value;
    this.editarCaracteristica.ESTADO_DE_CUMPLIMIENTO = this.form.get('estadoCumplimiento').value;
    this.editarCaracteristica.OBSERVACIONES = this.form.get('observaciones').value;
    this.editarCaracteristica.ACCIONES_A_REALIZAR = this.form.get('acciones').value;
    this.editarCaracteristica.RESPONSABLE = this.form.get('responsable').value;
    this.editarCaracteristica.ESTADO_ABIERTO_CERRADO = this.form.get('estado').value;
    this.editarCaracteristica.FECHA_EJECUCION = this.form.get('fecha').value;
    if (this.isChecked==true)
      this.editarCaracteristica.MEJORA_CONTINUA = 1;
    else
      this.editarCaracteristica.MEJORA_CONTINUA = 0;
    
    this.ApiService.putMatrizPartesInteresadas(this.editarCaracteristica).subscribe((data) => {
      const title = "Actualizacion exitosa.";
      const message = "El registro se ha realizado exitosamente";
      this.Message.showModal(title, message);

      this.fnChangeEditarStatus(true);
      this.fnConsultMatrizPartesInteresadas();
      this.caracteristicaIndice = -1;
      this.limpiarCampos();
    })
  }
  addDatosParteInteresada() {
    this.ParteInteresada = this.form.get('interesada').value;
    this.Necesidad = this.form.get('necesidades').value;
    this.Expectativa = this.form.get('expectativas').value;
    this.Cumplimiento = this.form.get('estadoCumplimiento').value;
    this.Observaciones = this.form.get('observaciones').value;
    this.Acciones = this.form.get('acciones').value;
    this.Fecha = this.form.get('fecha').value;
    this.Responsable = this.form.get('responsable').value;
    this.Estado = this.form.get('estado').value;

    if (this.option == 'cumple') {
      this.Observaciones = '-';
      this.Acciones = '-';
      this.Fecha = '-';
      this.Responsable = '-';
      this.Estado = '-';
      this.mejoraContinua = 0;
    }
    else { this.mejoraContinua = 1; }

    const ORDEN = {
      proveedores: 1,
      gubernamentales: 2,
      nogubernamentales: 3,
      clientes: 4,
      huespedes: 5,
      colaboradores: 6,
      accionistas: 7,
      comunidad: 8,
      comunidadvulnerable: 9,
      atractivos: 10,
      otro: 11
    }

    if (this.ParteInteresada.length && this.Necesidad.length && this.Expectativa.length && this.Cumplimiento.length > 0) {
      const request = {
        ID_MATRIZ_PARTES_INTERESADAS: Number(0),
        ID_INTERESADA: Number(ORDEN[this.form.get('interesada').value]),
        PARTE_INTERESADA: this.ParteInteresada,
        NECESIDAD: this.Necesidad,
        EXPECTATIVA: this.Expectativa,
        ESTADO_DE_CUMPLIMIENTO: this.Cumplimiento,
        OBSERVACIONES: this.Observaciones,
        ACCIONES_A_REALIZAR: this.Acciones,
        RESPONSABLE: this.Responsable,
        ESTADO_ABIERTO_CERRADO: this.Estado,
        ESTADO_ACTIVO_INACTIVO: Number(1),
        ID_USUARIO: parseInt(localStorage.getItem("Id")),
        FECHA_EJECUCION: this.Fecha,
        MEJORA_CONTINUA: Number(this.mejoraContinua)
      }
      this.ApiService.postMatrizPartesInteresadas(request).subscribe((data) => {
        this.fnConsultMatrizPartesInteresadas();
        this.limpiarCampos();
        this.ParteInteresada = '';
        this.Necesidad = '';
        this.Expectativa = '';
        this.Cumplimiento = '';
        this.Observaciones = '';
        this.Acciones = '';
        this.Fecha = '';
        this.Responsable = '';
        this.Estado = '';
        const title = "Registro exitoso";
        const message = "El registro se ha realizado exitosamente";
        this.Message.showModal(title, message);
        this.pages = 1;
        this.currentPage = 1
      },
        (error) => {
          const title = "Error en la petición";
          const message = "La parte interesada ya se encuentra registrada y no se permite un doble registro. Seleccione otra opción.";
          this.Message.showModal(title, message);
        }
      );
    }
    else {
      const title = "Registro no exitoso";
      const message = "Por favor verifique la fecha y complete todo los campos"
      this.Message.showModal(title, message);
      //Ya éxiste un registro para esta parte interesada
    }
  }

  getOption() {
    this.option = this.form.get('estadoCumplimiento').value;
  }

  ID_RESPUESTA_FORMULARIOS: number;

  generatePDF() {
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
    const a = this.rolessArray.forEach(dato => { dato.ID_INTERESADA == 2 ? console.log(dato.NECESIDAD) : '-' });
    const pdfDefinition: any = {
      header: {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
              { image: this.logo, fit: [50, 50], alignment: 'center', margin: [0, 3, 0, 3], rowSpan: 2 },
              { text: this.pst, alignment: 'center', margin: [0, 21, 0, 21], rowSpan: 2 },
              { text: 'MATRIZ DE PARTES INTERESADAS', alignment: 'center', rowSpan: 2, margin: [0, 9, 0, 9] },
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
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 1).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 1).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 1).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 1).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 1).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 1).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 1).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 1).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 1).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
              ],
              [
                { text: 'ORGANIZACIONES GUBERNAMENTALES', style: ['tituloTabla'] },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 2).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 2).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 2).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 2).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 2).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 2).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 2).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 2).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 2).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
              ],
              [
                { text: 'ORGANIZACIONES NO GUBERNAMENTALES', style: ['tituloTabla'] },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 3).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 3).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 3).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 3).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 3).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 3).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 3).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 3).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 3).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
              ],
              [
                { text: 'CLIENTE(S)', style: ['tituloTabla'] },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 4).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 4).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 4).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 4).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 4).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 4).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 4).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 4).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 4).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
              ],
              [
                { text: 'HUÉSPEDES', style: ['tituloTabla'] },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 5).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 5).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 5).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 5).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 5).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 5).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 5).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 5).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 5).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
              ],
              [
                { text: 'COLABORADORES (Personal directo y/o indirecto)', style: ['tituloTabla'] },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 6).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 6).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 6).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 6).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 6).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 6).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 6).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 6).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 6).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
              ],
              [
                { text: 'ACCIONISTAS O PROPIETARIOS', style: ['tituloTabla'] },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 7).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 7).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 7).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 7).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 7).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 7).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 7).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 7).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 7).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
              ],
              [
                { text: 'COMUNIDAD ', style: ['tituloTabla'] },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 8).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 8).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 8).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 8).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 8).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 8).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 8).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 8).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 8).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
              ],
              [
                { text: 'COMUNIDAD VULNERABLE', style: ['tituloTabla'] },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 9).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 9).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 9).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 9).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 9).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 9).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 9).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 9).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 9).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
              ],
              [
                { text: 'ATRACTIVOS TURÍSTICOS', style: ['tituloTabla'] },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 10).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 10).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 10).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 10).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 10).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 10).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 10).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 10).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 10).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
              ],
              [
                { 
                  text: `OTRA, ¿CUÁL? : ${filterData.filter(e => e.ORDEN === 4).length > 0 ? filterData[4]?.RESPUESTA : '-'}`,
                  style: ['tituloTabla']
                },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 11).map(dato => dato.NECESIDAD) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 11).map(dato => dato.EXPECTATIVA) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 11).map(dato => dato.ESTADO_DE_CUMPLIMIENTO) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 11).map(dato => dato.OBSERVACIONES) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 11).map(dato => dato.ACCIONES_A_REALIZAR) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 11).map(dato => dato.FECHA_EJECUCION) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 11).map(dato => dato.RESPONSABLE) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 11).map(dato => dato.FECHA_REGISTRO.split(' ')[0]) || '-' },
                { text: this.rolessArray.filter(dato => dato.ID_INTERESADA === 11).map(dato => dato.ESTADO_ABIERTO_CERRADO) || '-' },
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
    pdfMake.createPdf(pdfDefinition).open();
    // Limpiar el formulario después de generar el PDF
    this.generarPDFActivo = true;
    //this.form.reset();
  }
}
