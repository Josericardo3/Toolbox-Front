import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from 'src/app/servicios/api/api.service'

@Component({
  selector: 'app-app-gestion-de-usuarios',
  templateUrl: './app-gestion-de-usuarios.component.html',
  styleUrls: ['./app-gestion-de-usuarios.component.css'],
})
export class AppGestionDeUsuariosComponent {
  contentArray: string[] = new Array(50).fill('')
  returnedArray: string[]
  showBoundaryLinks: boolean = true
  showDirectionLinks: boolean = true
  constructor(private ApiService: ApiService, private router: Router) {}

  idGrupo = localStorage.getItem('idGrupo')
  idEmpresa = localStorage.getItem('idEmpresa')
  dataUser: any = []
  ngOnInit() {
    this.onLoadPst()
  }

  valoresPst: any = {}
  capturarValor(id: string | number, valor: any) {
    this.valoresPst[id] = valor
    console.log(this.valoresPst[id], 'capturar valor')
  }

  linkToDashboard(evt: any) {
    this.router.navigate(['/dashboard'])
  }

  onLoadPst() {
    console.log(this.idGrupo, 'grupoprueba')
    this.ApiService.assignAdvisor(this.idGrupo).subscribe((data) => {
      this.dataUser = data
      console.log(data)
    })
  }

  filterRnt(event: any) {
    let rnt = this.dataUser.map((item) =>
      event.target.value.toUpperCase().includes(item.rnt)
        ? item
        : 'no hay rsultado',
    )

    console.log(rnt, 'rnt')
    this.dataUser = rnt
    return this.dataUser
  }

  filterEmpresa(event: any) {
    let nombrePst = this.dataUser.map((item) =>
      event.target.value.toUpperCase().includes(item.nombrepst)
        ? item
        : 'no hay rsultado',
    )
    console.log(nombrePst, event, 'nombre', this.dataUser)

    this.dataUser = nombrePst
    return this.dataUser
  }

  filterAsesor(event: any) {
    let asesorAsignado = this.dataUser.map((item) =>
      event.target.value.includes(item.asesorasignado)
        ? item
        : 'no hay rsultado',
    )
    console.log(asesorAsignado, event, 'nombre', this.dataUser)

    this.dataUser = asesorAsignado
    return this.dataUser
  }
  filterEstado(event: any) {
    let asesorAsignado = this.dataUser.map((item) =>
      event.target.value.includes(item.estadoatencion)
        ? item
        : 'no hay rsultado',
    )
    console.log(asesorAsignado, event, 'nombre', this.dataUser)

    this.dataUser = asesorAsignado
    return this.dataUser
  }
}
