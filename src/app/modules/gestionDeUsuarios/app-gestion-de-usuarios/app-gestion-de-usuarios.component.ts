import { Component, OnInit, HostListener } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/servicios/api/api.service'
import { FiltroTableLista } from 'src/app/servicios/api/models/paginador'

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
  constructor(public ApiService: ApiService, 
              private router: Router,
              ) {
           }

  idGrupo = localStorage.getItem('idGrupo')
  idEmpresa = localStorage.getItem('idEmpresa')
  dataUser: any = []
  ngOnInit() {
    this.onLoadPst()
    //document.getElementById('modalPst').style.display = 'none'
  }

  valoresPst: any = {}
  capturarValor(id: string | number, valor: any) {
    this.valoresPst[id] = valor
    console.log(this.valoresPst[id], 'capturar valor')
  }

  linkToDashboard(user: any) {
    console.log(user,"user");
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
        //console.log(item, 'item', this.guardarEvent, 'guardarevent')
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
        console.log(item, 'item', this.guardarEvent, 'guardarevent')
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
      console.log(this.guardarEvent, 'evento estado')
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
    console.log(startItem,endItem,event.itemsPerPage,event.page,"finalpage")
    this.returnedArray = this.dataInitial.slice(startItem, endItem)
  }

  contenidoAsignacion: any = {};
   nuevoAsesor(evnt:any){
    this.contenidoAsignacion=evnt;
    console.log(evnt,'contenido')
    return this.openModalPst()
   }

  openModalPst() {
    this.ApiService.addAsesor().subscribe((dataAsesor) => {
      const guardarResult = localStorage.setItem(
        'listaAsesor',
        JSON.stringify(dataAsesor),
      )
      this.arrListAsesor = dataAsesor
      //console.log('asesor,gestion')
      this.isOpen = !this.isOpen;
      //document.getElementById('modalPst').style.display = 'block'
    })
  }
 
  isOpen = false;
  cerrar() {
    this.isOpen = !this.isOpen;
  }

  opcionSeleccionado: any = ''
  verSeleccion = {}
  guardarSeleccion: any = {}
  capturarValueSelect(evnt: any) {
    //valor seleccionado
    this.verSeleccion = this.opcionSeleccionado.nombre;
    //seleccion de la lista
    this.guardarSeleccion = this.opcionSeleccionado;
    console.log(this.verSeleccion,this.opcionSeleccionado, 'evento', 'nuevoseleccion')
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
    document.getElementById('modalAsesor').style.display = 'block'
  }

}
