import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/servicios/api/api.service'
// import { AppDeleteActivitiesComponent } from '../app-delete-activities/app-delete-activities.component';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { Console, debug } from 'console';

@Component({
  selector: 'app-app-planificacion',
  templateUrl: './app-planificacion.component.html',
  styleUrls: ['./app-planificacion.component.css'],
})
export class AppPlanificacionComponent {
  public showModal: boolean = false;
  selectedState: any = '';
  crearNuevoRegistro: boolean = false;
  filter: boolean = false;
  caracteristicaIndice: number;
  rolesArray: any = [];
  modal: boolean = false
  statecolor: any = '';
  rolesArraytemp: any = [];
  arrayListResponsible: any = [];
  arrayActivity: any = [];
  arrayStatus: any = [];
  arrayStatusRol: any = [];
  idResponsible!: number;
  activity: any = [];
  description: string = '';
  startActivityDate: any = '';
  endtActivityDate: any = '';
  nameResponsible: string;
  showModalCampos: boolean = false;
  idUsuario: any = [];
  idResponsable!: number;
  descripcion!: string;
  pages = 1;

  constructor(
    public ApiService: ApiService,
    private modalService: BsModalService,
    // private AppDeleteActivitiesComponent: AppDeleteActivitiesComponent,
    private Message: ModalService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.caracteristicaIndice = -1;
    this.caracteristicaIndiceEliminar = -1;
    this.showModal = false;
    this.fnConsultActivities();
    this.fnListResponsible();
    this.fnTypeOfActivity();
    this.fnStatusList();
    this.fnStatusListRol();
  }

  dataInitial: any = [];
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  datatotal: number = 0;
  contentArray: any = [];
  result: boolean = false;
  responsibleValue: any = '';
  valorRecibido = 0;
  typeActivityValue: any = '';
  rolesValue: any = '';
  activityValue: any = '';
  stateSelected: any = '';
  startDateValue: any = '';
  endDateValue: any = '';
  StatusRolValue: any = '';
  indiceAEliminar: number = -1;
  caracteristicaIndiceEliminar: number = -1;
  editarCaracteristica: any = {};
  currentPage: number = 1


  fnSubirFoto(e?: any) {

    if (e.target.files.length > 0) {
      const reader = new FileReader();
      const file = e.target.files[0]; // Obtener el archivo de la lista de archivos seleccionados

      // Leer el archivo y convertirlo a base64
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const image = new Image();

        image.onload = () => {
          const width = image.width;
          const height = image.height;

          const MAX_WIDTH = 250;
          const MAX_HEIGHT = 250;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const title = "Error de carga";
            const message = `Las dimensiones del logo no deben exceder ${MAX_WIDTH}x${MAX_HEIGHT} píxeles.`;
            this.Message.showModal(title, message);
            return;
          }

          // Las dimensiones del logo son válidas, enviar el archivo a través del servicio
          this.ApiService.putLogo(base64Data).subscribe((data) => {
            const title = "Carga exitosa.";
            const message = "El registro se ha cargado exitosamente";
            this.Message.showModal(title, message);
          });
        };

        image.src = base64Data;
      };

      reader.readAsDataURL(file); // Leer el archivo como base64
    }
  }

  recibirValor(valor: number) {
    this.valorRecibido = valor;
    this.caracteristicaIndiceEliminar = this.valorRecibido;
    if (valor == -2) this.fnConsultActivities();
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

  fnListResponsible() {
    const idPerfil = this.getRolValue();
    if(idPerfil == 3){
      this.ApiService.getPSTSelect().subscribe((data) => {
        this.arrayListResponsible = data;
  
      })
    }else{
      this.ApiService.getListResponsible().subscribe((data) => {
        this.arrayListResponsible = data;
  
      })
    }
  }

  fnTypeOfActivity() {
    this.ApiService.getTypeList(15).subscribe((data) => {
      this.arrayActivity = data.filter((e: any) => e.ITEM != 0);
    })
  }

  fnStatusList() {
    this.ApiService.getTypeList(18).subscribe((data) => {
      this.arrayStatus = data.filter((e: any) => e.ITEM != 0);
    })
  }

  fnStatusListRol() {
    this.ApiService.getTypeList(1).subscribe((data) => {
      this.arrayStatusRol = data.filter((e: any) => e.ITEM != 0);
    })
  }

  onResponsibleSelectionChange() {
    const selectedResponsible = this.arrayListResponsible.find(responsible => responsible.idUsuario === this.idUsuario);
    this.nameResponsible = selectedResponsible?.nombrePst;
  }

  onResponsibleSelectionChangeEditar(event: any) {
    this.idResponsable = this.editarCaracteristica.idUsuario
  }
  startActivityDateTemp: any;
  endtActivityDateTemp: any;

  fnNewRecord() {

    if (typeof (this.startActivityDate) == 'object' && typeof (this.endtActivityDate) == 'object') {
      const inicioValue = new Date(this.startActivityDate);
      const finValue = new Date(this.endtActivityDate);
      if (finValue < inicioValue) {
        const title = "Registro no exitoso";
        const message = "Por favor verifique la fecha";
        this.Message.showModal(title, message);
        return;
      } else {
        this.startActivityDate = this.startActivityDate.getDate().toString().padStart(2, '0') + "-" + (this.startActivityDate.getUTCMonth() + 1).toString().padStart(2, '0') + "-" + this.startActivityDate.getUTCFullYear();
        this.endtActivityDate = this.endtActivityDate.getDate().toString().padStart(2, '0') + "-" + (this.endtActivityDate.getUTCMonth() + 1).toString().padStart(2, '0') + "-" + this.endtActivityDate.getUTCFullYear();
      }
    }

    if (this.endtActivityDate.length && this.startActivityDate.length && this.activity.length && this.selectedState.length > 0 && this.description != '' && this.description.length != 0) {

      const request = {
        FK_ID_USUARIO_PST: parseInt(localStorage.getItem("Id")),
        FK_ID_RESPONSABLE: this.idUsuario,
        TIPO_ACTIVIDAD: this.activity,
        DESCRIPCION: this.description,
        FECHA_INICIO: this.startActivityDate,
        FECHA_FIN: this.endtActivityDate,
        ESTADO_PLANIFICACION: this.selectedState
      };
      this.ApiService.postNewRecord(request).subscribe((data) => {
        this.fnConsultActivities();
        this.fnNuevoRegistroCancelar();
        this.caracteristicaIndiceEliminar = -1;
        this.idUsuario = '';
        this.activity = '';
        this.description = '';
        this.startActivityDate = '';
        this.endtActivityDate = '';
        this.selectedState = '';
        this.nameResponsible = '';
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


  fnModalAvatar() {
    this.modal = true
    this.crearNuevoRegistro = false;
  }

  fnShowModal(index: number) {
    this.descripcion = this.rolesArray[index].DESCRIPCION;
    this.showModal = true;
  }

  fnNuevoRegistro() {
    this.crearNuevoRegistro = true;
    this.filter = false
    this.fnListResponsible();
  }

  fnNuevoRegistroCancelar() {
    this.crearNuevoRegistro = false;
    this.caracteristicaIndiceEliminar = -1;
    this.idUsuario = '';
    this.activity = '';
    this.description = '';
    this.startActivityDate = '';
    this.endtActivityDate = '';
    this.selectedState = '';
    this.nameResponsible = '';
  }

  fnFiltro() {
    this.filter = !this.filter;
    this.crearNuevoRegistro = false;
  }

  captureResponsibleValue(value: any) {
    this.result = false;
    this.responsibleValue = value.trim();
  }

  captureValueActivity(event: any) {
    this.result = false;
    this.activityValue = event.target.value.trim();
  }

  captureValueRoles(event: any) {
    this.result = false;
    this.rolesValue = event.target.value.trim();
  }

  captureTypeActivityValue(event: any) {
    this.result = false;
    this.typeActivityValue = event.target.value.trim();
  }

  capturestateSelected(event: any) {
    this.result = false;
    this.stateSelected = event.target.value.trim();
  }

  captureValueStartDate(event: any) {
    this.result = false;
    this.startDateValue = event.target.value.trim();
  }

  captureValueEndDate(event: any) {
    this.endDateValue = event.target.value.trim().toUpperCase();
  }


  captureValueStatusRol(event: any) {
    this.result = false;
    this.StatusRolValue = event.target.value.trim().toUpperCase();
  }

  filterResult() {
    this.result = false;
    this.contentArray = [];
    if (typeof (this.startDateValue) == 'object') {
      this.startDateValue = this.startDateValue?.getDate().toString().padStart(2, '0') + "-" + (this.startDateValue.getUTCMonth() + 1).toString().padStart(2, '0') + "-" + this.startDateValue.getUTCFullYear();
    }
    if (typeof (this.endDateValue) == 'object') {
      this.endDateValue = this.endDateValue?.getDate().toString().padStart(2, '0') + "-" + (this.endDateValue.getUTCMonth() + 1).toString().padStart(2, '0') + "-" + this.endDateValue.getUTCFullYear();
    }

    let arrayTemp = this.dataInitial.filter((item) =>
      (item.NOMBRE_RESPONSABLE.toUpperCase().includes(this.responsibleValue.toUpperCase()) || this.responsibleValue == '')
      && (item.TIPO_ACTIVIDAD.trim().toUpperCase().includes(this.typeActivityValue.toUpperCase()) || this.typeActivityValue == '')
      && (item.DESCRIPCION.trim().toUpperCase().includes(this.activityValue.toUpperCase()) || this.activityValue == '')
      && (item.FECHA_INICIO.trim().toUpperCase().includes(this.startDateValue) || this.startDateValue == '')
      && (item.FECHA_FIN.trim().toUpperCase().includes(this.endDateValue) || this.endDateValue == '')
      && (item.ESTADO_PLANIFICACION.trim().toUpperCase().includes(this.stateSelected.toUpperCase()) || this.stateSelected == '')
      && (item.CARGO?.trim().toUpperCase().includes(this.rolesValue.toUpperCase()) || this.rolesValue == '')
    )


    this.rolesArray = arrayTemp;

    ///para el paginado
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

  fnPlanifiacacionEditarCancelar() {
    this.caracteristicaIndice = -1;
    this.caracteristicaIndiceEliminar = -1
  }

  fnPlanningEdit(indice: number) {

    this.caracteristicaIndice = indice;
    this.caracteristicaIndiceEliminar = indice;
    this.editarCaracteristica = {};
    Object.assign(this.editarCaracteristica, this.rolesArray[indice]);
    this.editarCaracteristica.FK_ID_RESPONSABLE = this.editarCaracteristica.FK_ID_RESPONSABLE;
    this.fnListResponsible();
  }

  fnPlanificacionEliminar(indice: any) {
    this.filter = false
    this.caracteristicaIndiceEliminar = indice;
    this.indiceAEliminar = this.rolesArray[indice].ID_ACTIVIDAD;

  }

  fnSchedulingUpdate(indice: number) {
    // Validar si las fechas son de tipo string 
    if (typeof this.editarCaracteristica.FECHA_INICIO === 'string') {
      const dateString = this.editarCaracteristica.FECHA_INICIO;
      const parts = dateString.split("-");
      const year = parseInt(parts[2], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[0], 10);

      this.editarCaracteristica.FECHA_INICIO = new Date(year, month, day);
    }
    if (typeof this.editarCaracteristica.FECHA_FIN === 'string') {
      const dateStringfecha_fin = this.editarCaracteristica.FECHA_FIN;
      const partsfecha_fin = dateStringfecha_fin.split("-");
      const yearfecha_fin = parseInt(partsfecha_fin[2], 10);
      const monthfecha_fin = parseInt(partsfecha_fin[1], 10) - 1;
      const dayfecha_fin = parseInt(partsfecha_fin[0], 10);

      this.editarCaracteristica.FECHA_FIN = new Date(yearfecha_fin, monthfecha_fin, dayfecha_fin);

    }


    if (typeof this.editarCaracteristica.FECHA_INICIO === 'object' || typeof this.editarCaracteristica.FECHA_FIN === 'object') {
      const inicioValue = new Date(this.editarCaracteristica.FECHA_INICIO);
      const finValue = new Date(this.editarCaracteristica.FECHA_FIN);
      // Verificar si FECHA_FIN es menor que FECHA_INICIO
      if (finValue < inicioValue) {
        const title = "Registro no exitoso";
        const message = "Por favor verifique la fecha";
        this.Message.showModal(title, message);
        return;
      }
    }

    // Convertir las fechas a formato string
    this.editarCaracteristica.FECHA_INICIO = this.editarCaracteristica.FECHA_INICIO?.getDate().toString().padStart(2, '0') + "-" + (this.editarCaracteristica.FECHA_INICIO?.getUTCMonth() + 1).toString().padStart(2, '0') + "-" + this.editarCaracteristica.FECHA_INICIO?.getUTCFullYear();
    this.editarCaracteristica.FECHA_FIN = this.editarCaracteristica.FECHA_FIN?.getDate().toString().padStart(2, '0') + "-" + (this.editarCaracteristica.FECHA_FIN?.getUTCMonth() + 1).toString().padStart(2, '0') + "-" + this.editarCaracteristica.FECHA_FIN?.getUTCFullYear();


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
      this.fnPlanifiacacionEditarCancelar();
      this.fnConsultActivities();

    })
  }

  pruebaDelete: any = [];
  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;



    if (this.responsibleValue || this.typeActivityValue || this.activityValue || this.startDateValue || this.endDateValue || this.stateSelected !== '') {
      this.datatotal = this.contentArray.length;
      this.rolesArray = this.contentArray.slice(startItem, endItem)

    } else {
      this.datatotal = this.dataInitial.length;
      this.rolesArray = this.dataInitial.slice(startItem, endItem)
    }
    this.totalRegistros = this.rolesArray.length;

    this.cd.detectChanges();

  }
  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }

}
