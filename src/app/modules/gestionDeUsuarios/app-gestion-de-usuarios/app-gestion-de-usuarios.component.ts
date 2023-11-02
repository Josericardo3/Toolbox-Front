import { Component, OnInit, HostListener } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/servicios/api/api.service'
import { FiltroTableLista } from 'src/app/servicios/api/models/paginador'
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms'
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { debug } from 'console'

@Component({
  selector: 'app-app-gestion-de-usuarios',
  templateUrl: './app-gestion-de-usuarios.component.html',
  styleUrls: ['./app-gestion-de-usuarios.component.css'],
})
export class AppGestionDeUsuariosComponent {
  arrNormas: any;
  arrResult: any;

  arrListAsesor: any = []
  returnedArray: any = []
  showBoundaryLinks: boolean = true

  showDirectionLinks: boolean = true
  rnt = []
  razonsocial = []
  guardarEvent = '';
  guardarEventRnt: any = '';
  guardarEventEmpresa: any = '';
  guardarEventAsesor: any = '';
  dataInitial = []
  paginador = [5, 10, 50, 100]
  result: boolean = false;
  filtroTable: FiltroTableLista = {
    RNT: 1,
    Empresa: '',
    Asesor: '',
    Estado: '',
    Filas: 10,
    Pagina: 1,
    TotalPaginas: 0,
    TotalRegistros: 0,
  }
  arrEstado = ['En Proceso', 'Finalizado', 'Sin Atencion']
  public registerNewAsesor!: FormGroup
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  constructor(public ApiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private Message: ModalService,
  ) {
  }

  idGrupo = localStorage.getItem('idGrupo')
  idEmpresa = localStorage.getItem('idEmpresa')
  dataUser: any = [];
  pages = 1;
  estadoatencionBtn: boolean = true;
  contentArray: any = [];
  TIPO_USUARIO: any; 
  showAddAsesor: boolean = true; 

  ngOnInit() {
    this.onLoadPst();
    document.getElementById('modalAsesor').style.display = 'none';
    this.TIPO_USUARIO = window.localStorage.getItem('TIPO_USUARIO');
    this.TIPO_USUARIO = Number(this.TIPO_USUARIO); 
    if(this.TIPO_USUARIO == 8 ){
      this.showAddAsesor= false; 
    }

    //validacion registar un nuevo asesor
    this.registerNewAsesor = this.formBuilder.group(
      {
        registroNacionalDeTurismo: ['', Validators.required],
        nombre: ['', Validators.required],
        correo: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],
      })

  }

  valoresPst: any = {}
  capturarValor(id: string | number, valor: any) {
    this.valoresPst[id] = valor
  }

  linkToDashboard(user: any) {
    localStorage.setItem('Id', user.FK_ID_USUARIO);
    localStorage.setItem('rol', '1');
    localStorage.setItem('TIPO_USUARIO','1');
    localStorage.setItem('idGrupo', '1');
    localStorage.setItem('rnt', user.RNT);

    this.ApiService.getNorma(user.ID_USUARIO).subscribe(
      (categ: any) => {
        this.arrNormas = categ;
        localStorage.setItem(
          "idCategoria",
          JSON.stringify(this.arrNormas[0].FK_ID_CATEGORIA_RNT));
    });
      this.ApiService.validateCaracterizacion(user.FK_ID_USUARIO).subscribe(
        (response) => {
          if (response) {
            this.ApiService.getNorma(user.FK_ID_USUARIO).subscribe(
              (data: any) => {

                if (
                  data[0].FK_ID_CATEGORIA_RNT === 5 ||
                  data[0].FK_ID_CATEGORIA_RNT === 2
                ) {
                  this.arrResult = data;

                  localStorage.setItem(
                    "norma",
                    JSON.stringify(this.arrResult)
                  );
                  //No funciona
                  /*
                  const modalInicial = document.querySelector(
                    "#modal-inicial"
                  ) as HTMLElement;
                  modalInicial.style.display = "block";*/
                } else {
                  this.arrResult = data;
                  localStorage.setItem(
                    "norma",
                    JSON.stringify(this.arrResult)
                  );
                  localStorage.setItem("normaSelected", data[0].NORMA);
                  localStorage.setItem("idNormaSelected", data[0].ID_NORMA);
                  //modified by mel
                  if( data[0].ID_NORMA === 1){
                  this.router.navigate(["/dashboard"]);
                  }else{
                    this.router.navigate(["/dashboard"]);
                  }
                 
                }
              }
            );
          } else {
            this.router.navigate(["/dashboard"]);
          }
        }
      );
    
    return this.router.navigate(['/dashboard'])

  }



 
  dataTotal = 0
  onLoadPst() {
   
    this.ApiService.assignAdvisor().subscribe((data) => {
      this.dataUser = data;
      this.dataInitial = data;
      this.contentArray = data;
      this.returnedArray = this.dataInitial.slice(0, 7)
      this.filtroTable.TotalRegistros = data.length;
      this.dataTotal = data.length;
      const totalPag = data.length
      this.filtroTable.TotalPaginas = Math.ceil(totalPag / 7) ;;
      return this.dataUser
    })
  }


  capturarValorRnt(event: any) {
    this.result = false;
    this.guardarEventRnt = event.target.value.trim();

  }

  capturarValorE(event: any) {
    this.result = false;
    this.guardarEvent = event.target.value
  }


  capturarValorEmpresa(event: any) {
    this.result = false;
    this.guardarEventEmpresa = event.target.value.trim();
  }

  capturarValorAsesor(event: any) {
    this.result = false;
    this.guardarEventAsesor = event.target.value.trim();
  }

  filterResult() {
    this.result = false;
    this.contentArray = [];
    let arrayTemp = this.dataInitial.filter((item) => 
      ( item.ESTADO_ATENCION.toUpperCase().includes(this.guardarEvent.trim().toUpperCase())  || this.guardarEvent.trim().toUpperCase() =='')&&
      ( item.RNT.toUpperCase().includes(this.guardarEventRnt.trim().toUpperCase())  || this.guardarEventRnt.trim().toUpperCase() =='')&&
      (  item.RAZON_SOCIAL_PST.toUpperCase().includes(this.guardarEventEmpresa.trim().toUpperCase() )  || this.guardarEventEmpresa.trim().toUpperCase() =='')&&
      (  item.ASESOR_ASIGNADO.toUpperCase().includes(this.guardarEventAsesor.trim().toUpperCase())  || this.guardarEventAsesor.trim().toUpperCase() =='')
    )
      this.returnedArray = arrayTemp;

       // para el paginado
      this.pages = 1;
      const totalPag = this.returnedArray.length;
      this.filtroTable.TotalPaginas = Math.ceil(totalPag / 7) ;
      this.contentArray = this.returnedArray;
      this.filtroTable.TotalRegistros = this.returnedArray.length;
      this.dataTotal = this.returnedArray.length;
      if(this.filtroTable.TotalRegistros == this.dataTotal && this.filtroTable.TotalRegistros>=7 ) this.filtroTable.TotalRegistros=7;
      this.returnedArray = this.returnedArray.slice(0, 7);
      return this.returnedArray.length > 0 ? this.returnedArray : this.result = true;
  }

  fnRefrescar() {
    this.filtroTable.Pagina = 1
    this.onLoadPst()
  }

  pageChanged(event: any): void {

    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;

    if (this.guardarEvent || this.guardarEventAsesor || this.guardarEventEmpresa !== '') {
      this.dataTotal = this.contentArray.length;
      this.returnedArray = this.contentArray.slice(startItem, endItem)


    } else {
      this.dataTotal = this.dataInitial.length;
      this.returnedArray = this.dataInitial.slice(startItem, endItem)
    }

    this.filtroTable.TotalRegistros = this.returnedArray.length;

  }

  contenidoAsignacion: any = {};
  nuevoAsesor(evnt: any) {
    this.contenidoAsignacion = evnt;
    return this.openModalPst()
  }

  openModalPst() {
    this.ApiService.addAsesor().subscribe((dataAsesor) => {
      const guardarResult = localStorage.setItem(
        'listaAsesor',
        JSON.stringify(dataAsesor),
      )
      this.arrListAsesor = dataAsesor
      this.isOpen = !this.isOpen;
    })
  }

  isOpen = false;
  cerrar() {
    this.isOpen = !this.isOpen;

  }
  cerraModalNewAsesor() {
    document.getElementById('modalAsesor').style.display = 'none'
  }
  opcionSeleccionado: any = ''
  verSeleccion = {}
  guardarSeleccion: any = {}
  capturarValueSelect(evnt: any) {
    //valor seleccionado
    this.verSeleccion = this.opcionSeleccionado.nombre;
    //seleccion de la lista
    this.guardarSeleccion = this.opcionSeleccionado;
  }

  //actualizar asesor
  updateNewAsesor() {
    const request = { "ID_PST": this.contenidoAsignacion?.ID_PST, "ID_ASESOR": this.guardarSeleccion.ID_ASESOR }
    this.ApiService.updateAsesor(request).subscribe((data) => {
      this.isOpen = !this.isOpen;
      return this.onLoadPst();
    })
  }

  //registras nuevo asesor
  openModalNuevoAsesor() {
    this.correo = '';
    this.registroNacionalDeTurismo = '';
    this.nombre = '';
    return document.getElementById('modalAsesor').style.display = 'block'
  }

  nombre = '';
  correo = '';
  registroNacionalDeTurismo = '';

  onChangeModalInput(evnt: any) {

    if (evnt.target.id === 'correo') {
      this.correo = evnt.target.value;
    }
    if (evnt.target.id === 'nombre') {
      this.nombre = evnt.target.value;
    }
    if (evnt.target.id === 'nuevo') {
      this.registroNacionalDeTurismo = evnt.target.value;
    }
  }


  //datos del form
  saveNewAsesor() {
    const request = {
      RNT: this.registerNewAsesor.get("registroNacionalDeTurismo")?.value,
      NOMBRE: this.registerNewAsesor.get("nombre")?.value,
      CORREO: this.registerNewAsesor.get("correo")?.value,

    }

    if (this.registerNewAsesor.status === 'VALID') {

      const title = "Registro exitoso";
      const message = "El registro se ha realizado exitosamente"
      this.Message.showModal(title, message);
      this.ApiService.createNewAsesor(request)
        .subscribe((data) => { 
          return this.cerraModalNewAsesor()
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
}
