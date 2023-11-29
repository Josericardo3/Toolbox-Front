import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { ColorLista } from 'src/app//servicios/api/models/color';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  @Input() esVisible=false;
  @Input() esInfoHeader=false;
  logo:any="";
  datos: any = [];
  nombre: any;
  colorHeader: ColorLista;
  isMobile: boolean;
  constructor(private ApiService: ApiService,private router: Router) { }
 
  ngOnInit() {
    this.ApiService.colorTempo();
    this.colorHeader = JSON.parse(localStorage.getItem("color")).header;
    const id = localStorage.getItem('Id');
    if (id != null || undefined) this.getNombreUsuario();
    this.detectMobile();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth < 780;
  }
  detectMobile() {
    this.isMobile = window.innerWidth < 780; // Definir un umbral según tus necesidades
 
    // Suscribirse al evento de redimensionamiento
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 780; // Actualizar el estado en tiempo real
      console.log(this.isMobile, "tanioaaaaaaaa:",window.innerWidth)
    });
  }
  Logo() {
    const url = 'https://www.gov.co/home'
    window.location.href = url;
  }
 
  getNombreUsuario() {
    this.ApiService.getUsuario()
      .subscribe(data => {
        this.datos = data
        this.nombre = this.datos.NOMBRE
        console.log("info usuario",this.datos)
        if(this.datos.LOGO=="" || this.datos.LOGO==undefined || this.datos.LOGO==null){
         this.logo=`../../../../assets/avatares/avatar${this.datos.FK_ID_TIPO_AVATAR}.svg`
        }else{
          this.logo=this.datos.LOGO;
        }
      })
  }
  irUserSettings(){
    this.router.navigate(["/userSettings"]);
  }
}
