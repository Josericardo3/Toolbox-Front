import { Component, OnInit, HostListener } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/servicios/api/api.service'
import { FiltroTableLista } from 'src/app/servicios/api/models/paginador'
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms'
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'

@Component({
  selector: 'app-app-gestion-de-usuarios',
  templateUrl: './app-gestion-de-usuarios.component.html',
  styleUrls: ['./app-gestion-de-usuarios.component.css'],
})
export class AppGestionDeUsuariosComponent {

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

  ngOnInit() {
    this.onLoadPst();
    document.getElementById('modalAsesor').style.display = 'none';

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
    localStorage.setItem('rolPst', user.rnt)
    return this.router.navigate(['/dashboard'])

  }
 
  dataTotal = 0
  onLoadPst() {

    this.ApiService.assignAdvisor(0).subscribe((data) => {
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
      ( item.estadoatencion.toUpperCase().includes(this.guardarEvent.trim().toUpperCase())  || this.guardarEvent.trim().toUpperCase() =='')&&
      ( item.rnt.toUpperCase().includes(this.guardarEventRnt.trim().toUpperCase())  || this.guardarEventRnt.trim().toUpperCase() =='')&&
      (  item.razonsocial.toUpperCase().includes(this.guardarEventEmpresa.trim().toUpperCase() )  || this.guardarEventEmpresa.trim().toUpperCase() =='')&&
      (  item.asesorasignado.toUpperCase().includes(this.guardarEventAsesor.trim().toUpperCase())  || this.guardarEventAsesor.trim().toUpperCase() =='')
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
    const request = { "idusuariopst": this.contenidoAsignacion?.idusuariopst, "idUsuario": this.guardarSeleccion.idUsuario }
    this.ApiService.updateAsesor(request).subscribe((data) => {
      this.isOpen = !this.isOpen;
      return this.onLoadPst();
    })
  }

  //registras nuevo asesor
  openModalNuevoAsesor() {
    //clear
    //console.log(this.correo,this.registroNacionalDeTurismo,this.nombre,"vacio esperado")
    this.correo = '';
    this.registroNacionalDeTurismo = '';
    this.nombre = '';
    //console.log(this.correo,this.registroNacionalDeTurismo,this.nombre,"vacio esperado")
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
      //console.log(evnt.target.value,"rnt valor")
    }
  }


  //datos del form
  saveNewAsesor() {
    const request = {
      rnt: this.registerNewAsesor.get("registroNacionalDeTurismo")?.value,
      nombre: this.registerNewAsesor.get("nombre")?.value,
      correo: this.registerNewAsesor.get("correo")?.value,

    }

    if (this.registerNewAsesor.status === 'VALID') {

      const title = "Registro exitoso";
      const message = "El registro se ha realizado exitosamente"
      this.Message.showModal(title, message);
      this.ApiService.createNewAsesor(request)
        .subscribe((data) => {
          //console.log(data,"data nuevo asesor")  
          return this.cerraModalNewAsesor()
        })
    }
  }
}
