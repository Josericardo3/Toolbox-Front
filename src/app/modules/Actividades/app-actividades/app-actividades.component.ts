import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { using } from 'rxjs';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ColorLista } from 'src/app/servicios/api/models/color';


@Component({
  selector: 'app-app-actividades',
  templateUrl: './app-actividades.component.html',
  styleUrls: ['./app-actividades.component.css'],
  providers: [DatePipe]
})
export class AppActividadesComponent {

  rolesArray: any = [];
  rolesArraytemp: any = [];
  dataInitial: any = [];
  crearNuevoRegistro: boolean = false;
  caracteristicaIndice: number;
  arrayListResponsible: any[] = [];
  arrayStatus: any = [];
  idUsuario: any;
  activity: string;
  inicioActivity: any;
  finActivity: any;
  selectedState: any;
  indiceAEliminar: number = -1;
  valorRecibido = 0;
  arrayActivity: any = [];
  activityType: string;
  pages = 1;
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  datatotal: number = 0;
  contentArray: any = [];
  currentPage: number = 1;
  showModal: boolean = false;
  descripcion!: string;
  editarCaracteristica: any = {};
  pruebaDelete: any = [];
  filter: string= '';
  showfilter: boolean = false;
  result: boolean = false;
  idResponsable!: number;

  ngSelectActividad = 1;
  ngSelectEstado = 1;
  ngSelectResponsable = 1;
  colorWallpaper: ColorLista;
  colorTitle: ColorLista;
  isCollapsed = true;
  mostrarNotificacion: boolean = false;


  constructor(
    public ApiService: ApiService,
    private Message: ModalService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ApiService.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;

    this.fnConsultActivities();
    this.fnListResponsible();
    this.fnStatusList();
    this.fnTypeOfActivity();

  }

  fnConsultActivities() {
    this.ApiService.getActivities().subscribe((data) => {
      this.rolesArraytemp = data;
      this.dataInitial = data;
      for (let i = 0; i < this.rolesArraytemp.length; i++) {
        if (this.rolesArraytemp[i].ESTADO_PLANIFICACION.toLowerCase() == "programado") {
          this.rolesArraytemp[i].statecolor = '#f5970a';
        }
        if (this.rolesArraytemp[i].ESTADO_PLANIFICACION.toLowerCase() == "en proceso") {
          this.rolesArraytemp[i].statecolor = '#f4f80b';
        }
        if (this.rolesArraytemp[i].ESTADO_PLANIFICACION.toLowerCase() == "demorado") {
          this.rolesArraytemp[i].statecolor = '#ff2a00';
        }
        if (this.rolesArraytemp[i].ESTADO_PLANIFICACION.toLowerCase() == "finalizado") {
          this.rolesArraytemp[i].statecolor = '#068460';
        }
      }
      this.rolesArray = this.rolesArraytemp;

      //paginado
      const totalPag = data.length;
      this.totalPaginas = Math.ceil(totalPag / 7);
      if (this.totalPaginas == 0) this.totalPaginas = 1;

      this.datatotal = this.dataInitial.length;
      this.rolesArray = this.dataInitial.slice(0, 7);
      this.contentArray = data;
      this.currentPage = 1
      if (this.datatotal >= 7) {
        this.totalRegistros = 7;
      } else {
        this.totalRegistros = this.dataInitial.length;
      }
    })
  }
  longActivity: number;
  fnGetLength(){
    this.longActivity=this.activity.length;
  }
  fnNuevoRegistro() {
    this.crearNuevoRegistro = true;
    this.showfilter = false;
  }

  fnCancelarNuevoRegistro() {
    this.crearNuevoRegistro = false;
  }
  
  fnActivityEdit(indice: number) {
    this.showfilter= false;
    this.caracteristicaIndice = indice;
    this.editarCaracteristica = {};
    Object.assign(this.editarCaracteristica, this.rolesArray[indice]);

    const fechaArrayInicio = this.editarCaracteristica.FECHA_INICIO.split('-');
    const fechaArrayFin = this.editarCaracteristica.FECHA_FIN.split('-');

    if (fechaArrayInicio.length === 3 && fechaArrayFin.length === 3) {
     
      // Convertir FECHA_INICIO
      const nuevaFechaInicio = new Date();
      nuevaFechaInicio.setDate(Number(fechaArrayInicio[0]));
      nuevaFechaInicio.setMonth(Number(fechaArrayInicio[1]) - 1);
      nuevaFechaInicio.setFullYear(Number(fechaArrayInicio[2]));

      this.editarCaracteristica.FECHA_INICIO = this.datePipe.transform(nuevaFechaInicio, 'yyyy-MM-dd');

      // Convertir FECHA_FIN
      const nuevaFechaFin = new Date();
      nuevaFechaFin.setDate(Number(fechaArrayFin[0]));
      nuevaFechaFin.setMonth(Number(fechaArrayFin[1]) - 1);
      nuevaFechaFin.setFullYear(Number(fechaArrayFin[2]));

      this.editarCaracteristica.FECHA_FIN = this.datePipe.transform(nuevaFechaFin, 'yyyy-MM-dd');
      
    } else {
      console.log("Formato de fecha no válido");
    }

  }

  onResponsibleSelectionChangeEditar(event: any) {
    this.idResponsable = this.editarCaracteristica.idUsuario
  }

  fnSchedulingUpdate(indice: number) {

    if (typeof this.editarCaracteristica.FECHA_INICIO === 'string' && typeof this.editarCaracteristica.FECHA_FIN === 'string') {
      const inicioValue = new Date(this.editarCaracteristica.FECHA_INICIO);
      const finValue = new Date(this.editarCaracteristica.FECHA_FIN);
      if (finValue < inicioValue) {
        const title = "Registro no exitoso";
        const message = "Por favor verifique la fecha";
        this.Message.showModal(title, message);
        return;
      }
      else {
         this.editarCaracteristica.FECHA_INICIO = this.datePipe.transform(this.editarCaracteristica.FECHA_INICIO, 'dd-MM-yyyy');
         this.editarCaracteristica.FECHA_FIN = this.datePipe.transform(this.editarCaracteristica.FECHA_FIN, 'dd-MM-yyyy');
      }
    }

    if (this.idResponsable != undefined) {
      this.editarCaracteristica.FK_ID_RESPONSABLE = this.idResponsable;
    }

   this.ApiService.putActivities(this.editarCaracteristica).subscribe((data) => {

      const title = "Actualizacion exitosa.";
      const message = "El registro se ha realizado exitosamente";
      this.Message.showModal(title, message);
   
      const selectedResponsible = this.arrayListResponsible.find(responsible => responsible.ID_USUARIO === this.editarCaracteristica.FK_ID_RESPONSABLE);
      this.rolesArray[indice].NOMBRE_RESPONSABLE = selectedResponsible?.NOMBRE;
      this.rolesArray[indice].FK_ID_RESPONSABLE = this.editarCaracteristica.FK_ID_RESPONSABLE;
      this.rolesArray[indice].DESCRIPCION = this.editarCaracteristica.DESCRIPCION;
      this.rolesArray[indice].TIPO_ACTIVIDAD = this.editarCaracteristica.TIPO_ACTIVIDAD;
      this.rolesArray[indice].FECHA_INICIO = this.editarCaracteristica.FECHA_INICIO;
      this.rolesArray[indice].FECHA_FIN = this.editarCaracteristica.FECHA_FIN;
      this.rolesArray[indice].ESTADO_PLANIFICACION = this.editarCaracteristica.ESTADO_PLANIFICACION;

      if (this.rolesArray[indice].ESTADO_PLANIFICACION.toLowerCase() == "programado") {
        this.rolesArray[indice].statecolor = '#f5970a';
      }
      if (this.rolesArray[indice].ESTADO_PLANIFICACION.toLowerCase() == "en proceso") {
        this.rolesArray[indice].statecolor = '#f4f80b';
      }
      if (this.rolesArray[indice].ESTADO_PLANIFICACION.toLowerCase() == "demorado") {
        this.rolesArray[indice].statecolor = '#ff2a00';
      }
      if (this.rolesArray[indice].ESTADO_PLANIFICACION.toLowerCase() == "finalizado") {
        this.rolesArray[indice].statecolor = '#068460';
      }

     this.fnActivityEditarCancelar();
     this.fnConsultActivities();

    })
  }

  fnActivityEditarCancelar() {
    this.caracteristicaIndice = -1;
  }

  fnListResponsible() {
    this.ApiService.getListResponsible().subscribe((data) => {
      this.arrayListResponsible = data;
      console.log(this.arrayListResponsible);
    })
  }

  fnStatusList() {
    this.ApiService.getTypeList(18).subscribe((data) => {
      this.arrayStatus = data.filter((e: any) => e.ITEM != 0);
    })
  }
  recibirNoticias: boolean = false;

  onChangeCheckbox(event: any) {
    this.recibirNoticias = event.target.checked;
    
  }

  //**NUEVO REGISTRO**
  fnNewRecord() {
    if (typeof this.inicioActivity === 'string' && typeof this.finActivity === 'string') {
      const inicioValue = new Date(this.inicioActivity);
      const finValue = new Date(this.finActivity);
      //ALMACENA EL VALOR DE LA FECHA ACTUAL
      const fechaActual = new Date();
      
      //MODIFICACION DE LA VALIDACION
      if ((finValue < inicioValue) || (inicioValue < fechaActual) || (finValue < fechaActual)){
        const title = "Registro no exitoso";
        const message = "Por favor verifique la fecha";
        this.Message.showModal(title, message);
        return;
      }
      else {
        this.inicioActivity = this.datePipe.transform(this.inicioActivity, 'dd-MM-yyyy');
        this.finActivity = this.datePipe.transform(this.finActivity, 'dd-MM-yyyy');
      }
    }
    if (this.activity.length  && this.inicioActivity.length && this.finActivity.length && this.selectedState.length && this.idUsuario.length > 0) {
      const request = {
        FK_ID_USUARIO_PST: parseInt(localStorage.getItem("Id")),
        FK_ID_RESPONSABLE: Number(this.idUsuario),
        DESCRIPCION: this.activity,
        FECHA_INICIO: this.inicioActivity,
        FECHA_FIN: this.finActivity,
        TIPO_ACTIVIDAD: this.activityType || "Mejora Continua",
        ESTADO_PLANIFICACION: this.selectedState, 
        ENVIO_CORREO: this.recibirNoticias
      }

      this.ApiService.postNewRecord(request).subscribe((data) => {
        this.fnConsultActivities();
        this.idUsuario = '';
        this.activity = '';
        this.inicioActivity = '';
        this.finActivity = '';
        this.finActivity = '';
        this.selectedState = '';
        const title = "Registro exitoso";
        const message = "El registro se ha realizado exitosamente";
        this.Message.showModal(title, message);
        this.pages = 1;
        this.currentPage = 1
      });
    }
    else {
      const title = "Registro no exitoso";
      const message = "Por favor verifique la fecha y complete todo los campos"
      this.Message.showModal(title, message);
    }
  }

  fnValidadorNewRecord(){
    const title = "Registro no exitoso";
    const message = "Ingrese todos los campos requeridos";
    this.Message.showModal(title, message);
  }

  fnPlanificacionEliminar(indice: any) {
    this.showfilter = false
    this.indiceAEliminar = this.rolesArray[indice].ID_ACTIVIDAD;
  }

  recibirValor(valor: number) {
    this.valorRecibido = valor;
    if (valor == -2) {
      this.currentPage = 1
      this.fnConsultActivities();
    }
  }

  fnTypeOfActivity() {
    this.ApiService.getTypeList(15).subscribe((data) => {
      this.arrayActivity = data.filter((e: any) => e.ITEM != 0);
    })
  }
 
  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;

    if (this.filter.trim() !== '') {
      this.datatotal = this.contentArray.length;
      this.rolesArray = this.contentArray.slice(startItem, endItem)
    } else {
      this.datatotal = this.dataInitial.length;
      this.rolesArray = this.dataInitial.slice(startItem, endItem)
    }
    this.totalRegistros = this.rolesArray.length;
    this.cd.detectChanges();
  }
 
  fnShowModal(index: number) {
    this.descripcion = this.rolesArray[index].DESCRIPCION;
    this.showModal = true;
  }

  fnFiltro() {
    this.showfilter = !this.showfilter;
    this.crearNuevoRegistro = false;
  }
  
  filterResult() {
    this.result = false;
    if (!this.filter) {
      this.rolesArray = this.dataInitial;
      //para el paginado
      this.pages = 1;
      const totalPag = this.rolesArray.length;
      this.totalPaginas = Math.ceil(totalPag / 7);
      if (this.totalPaginas == 0) this.totalPaginas = 1;
      this.contentArray = this.rolesArray;
      this.totalRegistros = this.rolesArray.length;
      this.datatotal = this.rolesArray.length;
      if (this.totalRegistros == this.datatotal && this.totalRegistros >= 7) this.totalRegistros = 7;
      this.rolesArray = this.rolesArray.slice(0, 7);
      return this.rolesArray.length > 0 ? this.rolesArray : this.result = true;
    }
    else{
      let arrayTemp = this.dataInitial.filter((item) => 
      (item.NOMBRE_RESPONSABLE.toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
     || (item.TIPO_ACTIVIDAD.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
       || (item.DESCRIPCION.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
      || (item.FECHA_INICIO.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
      || (item.FECHA_FIN.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
      || (item.NOMBRE_PST?.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
      || (item.ESTADO_PLANIFICACION.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
      )
      this.contentArray = [];
      this.rolesArray = arrayTemp;
      //para el paginado
      this.pages = 1;
      const totalPag = this.rolesArray.length;
      this.totalPaginas = Math.ceil(totalPag / 7);
      if (this.totalPaginas == 0) this.totalPaginas = 1;
      this.contentArray = this.rolesArray;
      this.totalRegistros = this.rolesArray.length;
      this.datatotal = this.rolesArray.length;
      if (this.totalRegistros == this.datatotal && this.totalRegistros >= 7) this.totalRegistros = 7;
      this.rolesArray = this.rolesArray.slice(0, 7);
      return this.rolesArray.length > 0 ? this.rolesArray : this.result = true;
    }
  }
  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }
}
