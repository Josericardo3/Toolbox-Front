import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-historial-noticias',
  templateUrl: './app-historial-noticias.component.html',
  styleUrls: ['./app-historial-noticias.component.css']
})
export class AppHistorialNoticiasComponent implements OnInit{
  datos: any = [];
  idNoticia: number; 
  dataInitial: any; 
  dato: string; 

    //paginación
    pages = 1;
    totalPaginas: number = 0;
    totalRegistros: number = 0;
    datatotal: number = 0; 
    contentArray: any = [];
    currentPage: number= 1

  constructor(
        private api: ApiService,
        private router: Router,
    ){}
  
  ngOnInit(){
    this.api.getHistorial()
    .subscribe(data => {
      this.datos = data;
      this.dataInitial= data;
    

       //paginado
       const totalPag = data.length;
       this.totalPaginas = Math.ceil(totalPag / 6) ;
       if(this.totalPaginas== 0) this.totalPaginas = 1;
      
       this.datatotal = this.dataInitial.length;
       this.datos = this.dataInitial.slice(0, 6);
       this.contentArray = data;
       this.currentPage = 1;
       if(this.datatotal>=6){
         this.totalRegistros = 6;
       }else{
         this.totalRegistros = this.dataInitial.length;
       }
    })
  }

  indexCard(index:number){
    const request = {
      FK_ID_USUARIO: parseInt(localStorage.getItem("Id")),
      TIPO: "Modulo",
      MODULO: "noticia"
    };
    this.api.postMonitorizacionUsuario(request).subscribe();  
    this.idNoticia = this.datos[index].FK_ID_NOTICIA;
    this.dato= this.datos[index].TIPO;
     if (this.dato == 'Noticia' && this.idNoticia != undefined ) {
      this.router.navigate(['/noticia'],{ state: { idNoticia: this.idNoticia, dato: this.dato} });
    }
   }

   pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage; 
    const endItem = event.page * event.itemsPerPage;
    this.datos = this.dataInitial.slice(startItem, endItem)
    this.totalRegistros = this.datos.length;
  }

}
