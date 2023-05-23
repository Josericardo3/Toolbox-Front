import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/servicios/api/api.service'
// import { AppDeleteActivitiesComponent } from '../app-delete-activities/app-delete-activities.component';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

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
  endtActivityDate: any ='';
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
  caracteristicaIndiceEliminar: number =-1;
  editarCaracteristica: any = {};
  currentPage: number= 1

  fnSubirFoto(e?: any) {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      const file = e.target.files[0]; // obtener el archivo de la lista de archivos seleccionados
  
      // leer el archivo y convertirlo a base64
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        // enviar el archivo a través del servicio
        this.ApiService.putLogo(base64Data).subscribe((data) => {
          const title = "Registro exitoso";
          const message = "Se ha subido el logo correctamente"
          this.Message.showModal(title, message);
        });
      };
      reader.readAsDataURL(file); // leer el archivo como base64
    }
  }
 
  recibirValor(valor: number) {  
    this.valorRecibido = valor;
    this.caracteristicaIndiceEliminar = this.valorRecibido;
    if(valor == -2) this.fnConsultActivities();
   
  }

  fnConsultActivities() {
    this.ApiService.getActivities().subscribe((data) => {
        this.rolesArraytemp = data;
        this.dataInitial = data;
        for (let i = 0; i < this.rolesArraytemp.length; i++) {
          if (this.rolesArraytemp[i].estadoplanificacion.toLowerCase() == "programado") {
            this.rolesArraytemp[i].statecolor = '#f5970a';
          }
          if (this.rolesArraytemp[i].estadoplanificacion.toLowerCase() == "en proceso") {
            this.rolesArraytemp[i].statecolor = '#f4f80b';
          }
          if (this.rolesArraytemp[i].estadoplanificacion.toLowerCase() == "demorado") {
            this.rolesArraytemp[i].statecolor = '#ff2a00';
          }
          if (this.rolesArraytemp[i].estadoplanificacion.toLowerCase() == "finalizado") {
            this.rolesArraytemp[i].statecolor = '#068460';
          }
        }
        this.rolesArray = this.rolesArraytemp;

        //paginado
        const totalPag = data.length;
        this.totalPaginas = Math.ceil(totalPag / 7) ;
        if(this.totalPaginas== 0) this.totalPaginas = 1;
       
        this.datatotal = this.dataInitial.length;
        this.rolesArray = this.dataInitial.slice(0, 7);
        this.contentArray = data;
       this.currentPage = 1
        if(this.datatotal>=7){
          this.totalRegistros = 7;
        }else{
          this.totalRegistros = this.dataInitial.length;
        }
      
    })
  }

  fnListResponsible() {
    this.ApiService.getListResponsible().subscribe((data) => {
      this.arrayListResponsible = data;

    })
  }

  fnTypeOfActivity() {
    this.ApiService.getTypeList(15).subscribe((data) => {
      this.arrayActivity = data.filter((e:any) => e.item!=0);
    })
  }

  fnStatusList() {
    this.ApiService.getTypeList(18).subscribe((data) => {
      this.arrayStatus =  data.filter((e:any) => e.item!=0);
    })
  }

  fnStatusListRol() {
    this.ApiService.getTypeList(17).subscribe((data) => {
      this.arrayStatusRol = data.filter((e:any) => e.item!=0);
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

    if (typeof(this.startActivityDate) == 'object' && typeof(this.endtActivityDate) == 'object') {
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

    if (this.endtActivityDate.length && this.startActivityDate.length && this.activity.length  && this.selectedState.length > 0 && this.description != '' && this.description.length !=0) {

        const request = {
          id: 0,
          idUsuarioPst: parseInt(localStorage.getItem("Id")),
          idResponsable: this.idUsuario,
          tipoActividad: this.activity,
          descripcion: this.description,
          fecha_inicio: this.startActivityDate,
          fecha_fin: this.endtActivityDate,
          estadoplanificacion: this.selectedState,
          nombreresponsable: this.nameResponsible
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
    this.descripcion = this.rolesArray[index].descripcion;
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
      (item.nombreresponsable.toUpperCase().includes(this.responsibleValue.toUpperCase()) || this.responsibleValue == '')
      && (item.tipoActividad.trim().toUpperCase().includes(this.typeActivityValue.toUpperCase()) || this.typeActivityValue == '')
      && (item.descripcion.trim().toUpperCase().includes(this.activityValue.toUpperCase()) || this.activityValue == '')
      && (item.fecha_inicio.trim().toUpperCase().includes(this.startDateValue) || this.startDateValue == '')
      && (item.fecha_fin.trim().toUpperCase().includes(this.endDateValue) || this.endDateValue == '')
      && (item.estadoplanificacion.trim().toUpperCase().includes(this.stateSelected.toUpperCase()) || this.stateSelected == '')
      && (item.cargo?.trim().toUpperCase().includes(this.rolesValue.toUpperCase()) || this.rolesValue == '')
    )

    this.rolesArray = arrayTemp;

    ///para el paginado
    this.pages = 1;
    const totalPag = this.rolesArray.length;
    this.totalPaginas = Math.ceil(totalPag / 7);
    if(this.totalPaginas== 0) this.totalPaginas = 1;
    this.contentArray = this.rolesArray;
    this.totalRegistros = this.rolesArray.length;
    this.datatotal = this.rolesArray.length;
    if(this.totalRegistros == this.datatotal && this.totalRegistros>=7 ) this.totalRegistros=7;
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
    this.editarCaracteristica.idUsuario = this.editarCaracteristica.idResponsable;
    this.fnListResponsible();
  }

  fnPlanificacionEliminar(indice: any) {
    this.filter = false
    this.caracteristicaIndiceEliminar = indice;
    this.indiceAEliminar = this.rolesArray[indice].id ;

  }
  fnSchedulingUpdate(indice: number) {

    if (typeof (this.editarCaracteristica.fecha_inicio) == 'object') {
      this.editarCaracteristica.fecha_inicio = this.editarCaracteristica.fecha_inicio?.getDate().toString().padStart(2, '0') + "-" + (this.editarCaracteristica.fecha_inicio.getUTCMonth() + 1).toString().padStart(2, '0') + "-" + this.editarCaracteristica.fecha_inicio.getUTCFullYear();
    }
    if (typeof (this.editarCaracteristica.fecha_fin) == 'object') {
      this.editarCaracteristica.fecha_fin = this.editarCaracteristica.fecha_fin?.getDate().toString().padStart(2, '0') + "-" + (this.editarCaracteristica.fecha_fin.getUTCMonth() + 1).toString().padStart(2, '0') + "-" + this.editarCaracteristica.fecha_fin.getUTCFullYear();
    }
    if (this.editarCaracteristica.fecha_fin < this.editarCaracteristica.fecha_inicio) {
      const title = "Registro no exitoso";
      const message = "Por favor verifique la fecha"
      this.Message.showModal(title, message);
    return;
     }
    if (this.idResponsable != undefined) {
      this.editarCaracteristica.idResponsable = this.idResponsable;
    }
    
    this.ApiService.putActivities(this.editarCaracteristica).subscribe((data) => {
      
      const title = "Actualizacion exitosa.";
      const message = "El registro se ha realizado exitosamente";
      this.Message.showModal(title, message);
      const selectedResponsible = this.arrayListResponsible.find(responsible => responsible.idUsuarioPst === this.editarCaracteristica.idUsuario);
      this.rolesArray[indice].nombreresponsable = selectedResponsible?.nombrePst;
      this.rolesArray[indice].idResponsable = this.editarCaracteristica.idResponsable;
      this.rolesArray[indice].descripcion = this.editarCaracteristica.descripcion;
      this.rolesArray[indice].tipoActividad = this.editarCaracteristica.tipoActividad;
      this.rolesArray[indice].fecha_inicio = this.editarCaracteristica.fecha_inicio;
      this.rolesArray[indice].fecha_fin = this.editarCaracteristica.fecha_fin;
      this.rolesArray[indice].estadoplanificacion = this.editarCaracteristica.estadoplanificacion;

        if (this.rolesArray[indice].estadoplanificacion.toLowerCase() == "programado") {
          this.rolesArray[indice].statecolor = '#f5970a';
        }
        if (this.rolesArray[indice].estadoplanificacion.toLowerCase() == "en proceso") {
          this.rolesArray[indice].statecolor = '#f4f80b';
        }
        if (this.rolesArray[indice].estadoplanificacion.toLowerCase() == "demorado") {
         this.rolesArray[indice].statecolor = '#ff2a00';
        }
        if (this.rolesArray[indice].estadoplanificacion.toLowerCase() == "finalizado") {
         this.rolesArray[indice].statecolor = '#068460';
        }
  
      this.fnPlanifiacacionEditarCancelar();
    })
  
  }

  pruebaDelete: any=[];
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

}
