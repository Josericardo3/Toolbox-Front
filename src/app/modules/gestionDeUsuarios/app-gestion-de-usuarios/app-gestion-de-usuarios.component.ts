import { Component, OnInit, HostListener } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/servicios/api/api.service'
import { FiltroTableLista } from 'src/app/servicios/api/models/paginador'
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms'
import { log } from 'console'
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
              private Message: ModalService,
              ) {
           }

  idGrupo = localStorage.getItem('idGrupo')
  idEmpresa = localStorage.getItem('idEmpresa')
  dataUser: any = []
  ngOnInit() {
    this.onLoadPst();
  
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
  estadoatencionBtn: boolean = true; ;
  onLoadPst() {
    this.ApiService.assignAdvisor(0).subscribe((data) => {
      this.dataUser = data
      this.dataInitial = data
      this.returnedArray = this.dataInitial.slice(0, 10)
      console.log( this.returnedArray,'yesiiiii');
      // for (let i = 0; i < this.returnedArray.length; i++) {
      //   if (this.returnedArray[i].estadoatencion === "Finalizado") {
      //     this.estadoatencionBtn = false;
      //     console.log( this.returnedArray[i].estadoatencion,'entro' );
      //   }
      // }
      this.filtroTable.TotalRegistros = data.length

      const totalPag = data.length
      this.filtroTable.TotalPaginas = Math.trunc(totalPag / 10);
      
      return this.dataUser
    })
  }
  result: boolean = false
  filterRnt() {
    
    if (this.guardarEvent != '') {
      let rnt = this.dataInitial.map((item) => {
        return item.rnt.toUpperCase().includes(this.guardarEvent.toUpperCase())
          ? item
          : 'no hay resultado'
      })
      let rntFinal = rnt.filter((item) => item != 'no hay resultado')
      this.returnedArray = rntFinal;
      this.filtroTable.TotalPaginas = this.returnedArray.length;
      console.log( this.returnedArray,111);
      console.log( this.returnedArray.length,222);
      return this.returnedArray.length>0? this.returnedArray: this.result= true;
    } else {
      this.onLoadPst()
    }
  }

  capturarValorE(event: any) {
    this.result= false;
    this.guardarEvent = event.target.value
  }

  guardarEventEmpresa: any;
  capturarValorEmpresa(event: any) {
    this.result= false;
    this.guardarEventEmpresa = event.target.value
  }

  filterEmpresa() {
    if (this.guardarEventEmpresa != '') {
      let razonsocial = this.dataInitial.map((item) => {
        return item.razonsocial
          .toUpperCase()
          .includes(this.guardarEventEmpresa.toUpperCase())
          ? item
          : 'no hay resultado'
      })
      let razonsocialFinal = razonsocial.filter(
        (item) => item != 'no hay resultado',
      )
      this.returnedArray = razonsocialFinal;
      this.filtroTable.TotalPaginas = this.returnedArray.length;
      console.log( this.returnedArray,333);
      console.log( this.returnedArray.length,444);
      
      return this.returnedArray.length>0? this.returnedArray: this.result= true;
      
    } else {
      this.onLoadPst()
    }
  }

  guardarEventAsesor: any;
  capturarValorAsesor(event: any) {
    this.result= false;
    this.guardarEventAsesor = event.target.value
  }

  filterAsesor() {
    if (this.guardarEventAsesor != '') {
      let asesor = this.dataInitial.map((item) => {
        return item.asesorasignado
          .toUpperCase()
          .includes(this.guardarEventAsesor.toUpperCase())
          ? item
          : 'no hay resultado'
      })
      let asesorFinal = asesor.filter((item) => item != 'no hay resultado')
      this.returnedArray = asesorFinal
      this.filtroTable.TotalPaginas = this.returnedArray.length;
      console.log( this.returnedArray,555);
      console.log( this.returnedArray.length,66);
      return this.returnedArray.length>0? this.returnedArray: this.result= true;
    } else {
      this.onLoadPst()
    }
  }

 
  filterEstado(evnt?: any) {
    this.estadoatencionBtn = true;
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
     
      for (let i = 0; i < this.returnedArray.length; i++) {
        if (this.returnedArray[i].estadoatencion === "Finalizado") {
          this.estadoatencionBtn = false;
        }
      }
      this.filtroTable.TotalPaginas = this.returnedArray.length;
      return this.returnedArray.length > 0 ? this.returnedArray : this.result = true;
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

    const title = "Registro exitoso";
    const message = "El registro se ha realizado exitosamente"
    this.Message.showModal(title,message); 
    this.ApiService.createNewAsesor(request)
.subscribe((data) =>{
  //console.log(data,"data nuevo asesor")
   return this.cerraModalNewAsesor()
})
  }
  }
}
