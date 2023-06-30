import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-app-noticias-completas',
  templateUrl: './app-noticias-completas.component.html',
  styleUrls: ['./app-noticias-completas.component.css']
})
export class AppNoticiasCompletasComponent implements OnInit{
  datos: any = [];
  idNoticia!: number;
  dato!: string; 
  dataInitial: any; 

  //paginación
  pages = 1;
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  datatotal: number = 0; 
  contentArray: any = [];
  currentPage: number= 1

  constructor(
    private api: ApiService,
    private router :Router 
  ){}

  ngOnInit(){
    this.getTarjetas();
  }

  getTarjetas(){
    this.api.getTarjeta()
    .subscribe(data => {
      this.datos = data;
      this.dataInitial= data;
      console.log(this.datos)
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

  indexCard(index: any, dato: string){
    this.idNoticia = index;
    this.dato= dato;
    this.router.navigate(['/noticia'],{ state: { idNoticia: this.idNoticia, dato: dato} });
   }

   pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage; 
    const endItem = event.page * event.itemsPerPage;
    this.datos = this.dataInitial.slice(startItem, endItem)
    this.totalRegistros = this.datos.length;
  }
}
