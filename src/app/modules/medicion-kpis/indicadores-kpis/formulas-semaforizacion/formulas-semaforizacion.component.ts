import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-formulas-semaforizacion',
  templateUrl: './formulas-semaforizacion.component.html',
  styleUrls: ['./formulas-semaforizacion.component.css']
})
export class FormulasSemaforizacionComponent {
@Input() esDetalle:boolean=false;
@Input() nMeta :any;
@Input() esIncremento :any;
@Input() esDisminuir :any;
displayedColumns:any=['nombre','formula','resultado','tendencia']
dataSource=[];
@Output() calcularResultado = new EventEmitter<string>();
  
ngOnChanges(){

  if(this.esIncremento){
    this.dataSource=[{ID:1,NOMBRE:'Exitosa',FORMULA:'[n+11%, 100%]', RESULTADO:`[${Number(this.nMeta)+11}%, 100%]`,TENDENCIA:'green',ICONO_TENDENCIA:'dot-green'},
    {ID:2,NOMBRE:'Aceptable',FORMULA:'[n, n+10%]', RESULTADO:`[${this.nMeta}%, ${Number(this.nMeta)+10}%]`,TENDENCIA:'yellow',ICONO_TENDENCIA:'dot-yellow'},
    {ID:3,NOMBRE:'Por Mejorar',FORMULA:'[0%, n-1%]',RESULTADO:`[0%, ${this.nMeta-1}%]`,TENDENCIA:'red',ICONO_TENDENCIA:'dot-red'}]
  }
  if(this.esDisminuir){
    this.dataSource=[{ID:1,NOMBRE:'Exitosa',FORMULA:'[n-1%,0%]', RESULTADO:`[${this.nMeta-11}%, 0%]`,TENDENCIA:'green',ICONO_TENDENCIA:'dot-green'},
    {ID:2,NOMBRE:'Aceptable',FORMULA:'[n,n-10%]', RESULTADO:`[${this.nMeta}%, ${this.nMeta-10}%]`,TENDENCIA:'yellow',ICONO_TENDENCIA:'dot-yellow'},
    {ID:3,NOMBRE:'Por Mejorar',FORMULA:'[n+1%, 100%]',RESULTADO:`[${Number(this.nMeta)+1}%, 100%]`,TENDENCIA:'red',ICONO_TENDENCIA:'dot-red'}]
  }
}
ngOnInit(){
 
  if(this.esIncremento){
    this.dataSource=[{ID:1,NOMBRE:'Exitosa',FORMULA:'[n+11%, 100%]', RESULTADO:`[${Number(this.nMeta)+11}%, 100%]`,TENDENCIA:'green',ICONO_TENDENCIA:'dot-green'},
    {ID:2,NOMBRE:'Aceptable',FORMULA:'[n, n+10%]', RESULTADO:`[${this.nMeta}%, ${Number(this.nMeta)+10}%]`,TENDENCIA:'yellow',ICONO_TENDENCIA:'dot-yellow'},
    {ID:3,NOMBRE:'Por Mejorar',FORMULA:'[0%, n-1%]',RESULTADO:`[0%, ${this.nMeta-1}%]`,TENDENCIA:'red',ICONO_TENDENCIA:'dot-red'}]
  }
  if(this.esDisminuir){
    this.dataSource=[{ID:1,NOMBRE:'Exitosa',FORMULA:'[n-11%,0%]', RESULTADO:`[${this.nMeta-11}%, 0%]`,TENDENCIA:'green',ICONO_TENDENCIA:'dot-green'},
    {ID:2,NOMBRE:'Aceptable',FORMULA:'[n,n-10%]', RESULTADO:`[${this.nMeta}%, ${this.nMeta-10}%]`,TENDENCIA:'yellow',ICONO_TENDENCIA:'dot-yellow'},
    {ID:3,NOMBRE:'Por Mejorar',FORMULA:'[n+1%, 100%]',RESULTADO:`[${Number(this.nMeta)+1}%, 100%]`,TENDENCIA:'red',ICONO_TENDENCIA:'dot-red'}]
  }

}

}
