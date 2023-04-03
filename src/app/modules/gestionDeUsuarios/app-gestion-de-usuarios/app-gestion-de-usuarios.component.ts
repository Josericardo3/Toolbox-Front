import { Component, OnInit, HostListener } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/servicios/api/api.service'
import { FiltroTableLista } from 'src/app/servicios/api/models/paginador'
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms'

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
  guardarEvent = ''
  dataInitial = []
  paginador = [5, 10, 50, 100]
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
  arrEstado = ['En proceso', 'Finalizado', 'sin atencion']
  public registerNewAsesor!: FormGroup
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  constructor(public ApiService: ApiService, 
              private router: Router,
              private formBuilder: FormBuilder,
              ) {
           }

  idGrupo = localStorage.getItem('idGrupo')
  idEmpresa = localStorage.getItem('idEmpresa')
  dataUser: any = []
  ngOnInit() {
    this.onLoadPst()
     document.getElementById('modalAsesor').style.display = 'none'
 
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
    localStorage.setItem('rolPst',user.rnt)
    return this.router.navigate(['/dashboard'])
    
  }

  onLoadPst() {
    this.ApiService.assignAdvisor(0).subscribe((data) => {
      this.dataUser = data
      this.dataInitial = data
      this.returnedArray = this.dataInitial.slice(0, 10)
      this.filtroTable.TotalRegistros = data.length

      const totalPag = data.length
      this.filtroTable.TotalPaginas = Math.trunc(totalPag / 10)
      return this.dataUser
    })
  }

  filterRnt() {
    if (this.guardarEvent != '') {
      let rnt = this.dataInitial.map((item) => {
        return item.rnt.toUpperCase().includes(this.guardarEvent.toUpperCase())
          ? item
          : 'no hay resultado'
      })
      let rntFinal = rnt.filter((item) => item != 'no hay resultado')
      this.returnedArray = rntFinal
      return this.returnedArray
    } else {
      this.onLoadPst()
    }
  }

  capturarValorE(event: any) {
    this.guardarEvent = event.target.value
  }

  filterEmpresa() {
    if (this.guardarEvent != '') {
      let razonsocial = this.dataInitial.map((item) => {
        return item.razonsocial
          .toUpperCase()
          .includes(this.guardarEvent.toUpperCase())
          ? item
          : 'no hay resultado'
      })
      let razonsocialFinal = razonsocial.filter(
        (item) => item != 'no hay resultado',
      )
      this.returnedArray = razonsocialFinal
      return this.returnedArray
    } else {
      this.onLoadPst()
    }
  }

  filterAsesor() {
    if (this.guardarEvent != '') {
      let asesor = this.dataInitial.map((item) => {
        return item.asesorasignado
          .toUpperCase()
          .includes(this.guardarEvent.toUpperCase())
          ? item
          : 'no hay resultado'
      })
      let asesorFinal = asesor.filter((item) => item != 'no hay resultado')
      this.returnedArray = asesorFinal
      return this.returnedArray
    } else {
      this.onLoadPst()
    }
  }
  filterEstado(evnt: any) {
    if (this.guardarEvent != '') {
      let estado = this.dataInitial.map((item) => {
        return item.estadoatencion
          .toUpperCase()
          .includes(this.guardarEvent.toUpperCase())
          ? item
          : 'no hay resultado'
      })
      let estadoFinal = estado.filter((item) => item != 'no hay resultado')
      this.returnedArray = estadoFinal
      return this.returnedArray
    }
  }

  fnRefrescar() {
    this.filtroTable.Pagina = 1
    this.onLoadPst()
  }

  pages = 1;
  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.dataInitial.slice(startItem, endItem)
  }

  contenidoAsignacion: any = {};
   nuevoAsesor(evnt:any){
    this.contenidoAsignacion=evnt;
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
cerraModalNewAsesor(){
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
  updateNewAsesor(){
    const request = { "idusuariopst": this.contenidoAsignacion?.idusuariopst,"idUsuario": this.guardarSeleccion.idUsuario}
    this.ApiService.updateAsesor(request).subscribe((data) =>{
      this.isOpen = !this.isOpen;
       return this.onLoadPst();
    })
  }

  //registras nuevo asesor
  openModalNuevoAsesor(){
    //clear
    //console.log(this.correo,this.registroNacionalDeTurismo,this.nombre,"vacio esperado")
    this.correo = '';
    this.registroNacionalDeTurismo = '';
    this.nombre = '';
    //console.log(this.correo,this.registroNacionalDeTurismo,this.nombre,"vacio esperado")
    return document.getElementById('modalAsesor').style.display = 'block'
  }

  nombre = '';
  correo='';
  registroNacionalDeTurismo= '';

onChangeModalInput(evnt :any){
  
if(evnt.target.id === 'correo'){
  this.correo = evnt.target.value;
}
if(evnt.target.id === 'nombre'){
  this.nombre = evnt.target.value;
}
if(evnt.target.id === 'nuevo'){
  this.registroNacionalDeTurismo = evnt.target.value;
  //console.log(evnt.target.value,"rnt valor")
}
}

//datos del form
saveNewAsesor(){
  const request = {
    rnt:this.registerNewAsesor.get("registroNacionalDeTurismo")?.value,
    nombre:this.registerNewAsesor.get("nombre")?.value,
    correo: this.registerNewAsesor.get("correo")?.value,

  }
  if(this.registerNewAsesor.status === 'VALID'){
    //console.log(this.registerNewAsesor.value)
    this.ApiService.createNewAsesor(request)
.subscribe((data) =>{
  //console.log(data,"data nuevo asesor")
   return this.cerraModalNewAsesor()
})
  }
  }
}
