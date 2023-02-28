//CATEGORIA Y SUBCATEGORIA
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class Categoria {
  name ={
    tipo:[
      {
        id:1 ,
        name:'GUÍA DE TURISMO'
      },
      {
        id:2 ,
        name:'ESTABLECIMIENTOS DE TRANSPORTE TERRESTRE AUTOMOTOR'
      },
      {
        id:3 ,
        name:'RESTAURANTES Y BARES TURÍSTICOS'
      },
      {
        id:4 ,
        name:'ESTABLECIMIENTOS DE ALOJAMIENTO TURISTICO'
      },
      {
        id:5 ,
        name:'AGENCIAS DE VIAJES'
      },
      {
        id:6 ,
        name:'EMPRESA DE TIEMPO COMPARTIDO Y MULTIPROPIEDAD'
      },
      {
        id:7 ,
        name:'OPERADORES PROFESIONALES DE CONGRESO FERIAS Y CONVENCIONES'
      },
    ],
    agencias:[
    {
      id:5,
      name:'AGENCIA DE VIAJES OPERADORAS'
    },
    {
      id:5,
      name:'AGENCIA DE VIAJES Y DE TURISMO'
    },
    {
      id:5,
      name:'AGENCIA DE VIAJES MAYORISTAS'
    },
    {
      id:6,
      name:'COMERCIALIZADORA'
    },
    {
      id:6,
      name:'PROMOTORA'
    },
    {
      id:6,
      name:'PROMOTORA Y COMERCIALIZADORA'
    },
    {
      id:2,
      name: 'OPERADOR DE CHIVAS'
    },
    {
      id:2,
      name: 'TRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL'
    },
    {
      id:4,
      name: 'ALBERGUE'
    },
    {
      id:4,
      name: 'ALOJAMIENTO RURAL'
    },
    {
      id:4,
      name: 'APARTAHOTEL'
    },
    {
      id:4,
      name: 'CAMPAMENTO'
    },
    {
      id:4,
      name: 'CENTRO VACACIONAL'
    },
    {
      id:4,
      name: 'HOSTAL'
    },
    {
      id:4,
      name: 'HOTEL'
    },
    {
      id:4,
      name: 'REFUGIO'
    },
    {
      id:4,
      name: 'POSADAS TURISTICAS'
    },
    {
      id:4,
      name: 'GLAMPING'
    },
    {
      id:3,
      name: 'RESTAURANTES'
    },
    {
      id:3,
      name: 'RESTAURANTES DE AUTOSERVICIOS'
    },
    {
      id:3,
      name: 'RESTAURANTES DE COMIDAS RAPIDAS'
    },
    {
      id:3,
      name: 'COMIDAS CALLEJERAS QUE SE ENCUENTRAN REGLAMENTADAS Y DEBIDAMENTE AUTORIZADAS POR LOS GOBIERNOS LOCALES'
    },
    {
      id:3,
      name: 'CAMIONES DE COMIDA DEBIDAMENTE AUTORIZADOS POR LA AUTORIDAD LOCAL'
    },
    {
      id:3,
      name: 'FRUTERIAS'
    },
    {
      id:3,
      name: 'HELADERIAS'
    },
    {
      id:3,
      name: 'SALSAMENTARIAS'
    },
    {
      id:3,
      name: 'PANADERIAS,REPOSTERIAS,PASTELERIAS O CHOCOLATERIAS'
    },
    {
      id:3,
      name: 'CAFES O CAFETERIAS'
    },
    {
      id:3,
      name: 'PIQUETEADEROS'
    },
    {
      id:3,
      name: 'CEVICHERIAS Y PESCADERIAS'
    },
    {
      id:3,
      name: 'BARES CON MUSICA EN VIVO'
    },
    {
      id:3,
      name: 'BARES SOCIALES'
    },
    {
      id:3,
      name: 'GASTROBARES'
    },
    {
      id:1,
      name: 'GUIA DE TURISMO'
    },
    {
      id:7,
      name: 'NO TIENE SUBCATEGORIA'
    },
    {
      id:8,
      name: 'OTROS TIPOS DE ALOJAMIENTO NO PERMANENTES'
    },
    {
      id:9,
      name: 'APARTAMENTOS TURISTICOS'
    },
    {
      id:9,
      name: 'FINCAS TURISTICAS'
    },
    {
      id:9,
      name: 'OTRO TIPO DE VIVIENDA TURISTICA'
    },
    ],
  }
}
