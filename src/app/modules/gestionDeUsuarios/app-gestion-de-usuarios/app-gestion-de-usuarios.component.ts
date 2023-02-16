import { Component, OnInit} from '@angular/core'
import { Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';


@Component({
  selector: 'app-app-gestion-de-usuarios',
  templateUrl: './app-gestion-de-usuarios.component.html',
  styleUrls: ['./app-gestion-de-usuarios.component.css'],
})
export class AppGestionDeUsuariosComponent {
 
  contentArray: string[] = new Array(50).fill('');
  returnedArray: string[];
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;
  constructor(
    private ApiService: ApiService,
    private router: Router,
  ) {}

  //pagination
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
 }
  idGrupo = localStorage.getItem("idGrupo");
  idEmpresa = localStorage.getItem("idEmpresa");
  dataUser: any = [];
  ngOnInit() {
    this.onLoadPst();
    //this.ApiService.assignAdvisor()
    // this.ApiService.assignAdvisor(this.pst);
    // console.log(this.pst,"RNT")
  }

  valoresPst: any = {};
  capturarValor(id: string | number, valor: any) {
    this.valoresPst[id] = valor;
    console.log(this.valoresPst[id], 'capturar valor')
  }

  linkToDashboard(evt: any){
    this.router.navigate(['/dashboard']); 
  }
  
  onLoadPst(){
    console.log(this.idGrupo,"grupoprueba")
    this.ApiService.assignAdvisor(this.idGrupo).subscribe(data => {
    this.dataUser = data;
      console.log(data);

    })}
    //filtroEspacio:any = { Modo: 1, Filtro: "", Orden: 'PR_PRODUCTO desc', Filas: 10, Pagina: 1, ItemsTotales: 0, TotalRegistros: 0 };

    filterRnt(event:any){
      let rnt =  this.dataUser.map(item =>((event.target.value).toUpperCase()).includes(item.rnt)?item : "no hay rsultado" )

      console.log(rnt,"rnt")
      this.dataUser = rnt;
      return this.dataUser;
    }

    filterEmpresa(event:any){
      let nombrePst = this.dataUser.map(item =>((event.target.value).toUpperCase()).includes(item.nombrepst)?item : "no hay rsultado" )
      console.log(nombrePst,event,"nombre",this.dataUser)

      this.dataUser = nombrePst ;
      return this.dataUser;
    }

    filterAsesor(event:any){
      let asesorAsignado = this.dataUser.map(item =>((event.target.value)).includes(item.asesorasignado)?item : "no hay rsultado" )
      console.log(asesorAsignado,event,"nombre",this.dataUser)

      this.dataUser = asesorAsignado ;
      return this.dataUser;
    }
    filterEstado(event:any){
      let asesorAsignado = this.dataUser.map(item =>((event.target.value)).includes(item.estadoatencion)?item : "no hay rsultado" )
      console.log(asesorAsignado,event,"nombre",this.dataUser)

      this.dataUser = asesorAsignado ;
      return this.dataUser;
    }
}
