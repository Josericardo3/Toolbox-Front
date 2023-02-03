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
        name:'AGENCIA DE VIAJES'
      },
      {
        id:2 ,
        name:'EMPRESA DE TIEMPO COMPARTIDO Y MULTIPROPIEDAD'
      },
      {
        id:3 ,
        name:'EMPRESA DE TRANSPORTE TERRESTRE AUTOMOTOR'
      },
      {
        id:4 ,
        name:'ESTABLECIMIENTOS DE ALOJAMIENTO TURISTICO'
      },
      {
        id:5 ,
        name:'ESTABLECIMIENTOS DE GASTRONOMIA Y BARES TURISTICOS'
      },
      {
        id:6 ,
        name:'GUIA DE TURISMO'
      },
      {
        id:7 ,
        name:'OPERADORES PROFESIONALES DE CONGRESO FERIAS Y CONVENCIONES'
      },
      {
        id:8 ,
        name:'OTROS TIPOS DE ALOJAMIENTO NO PERMANENTES'
      },
      {
        id:9 ,
        name:'VIVIENDA TURISTICA'
      },
    ],
    agencias:[
    {
      id:1,
      name:'AGENCIA DE VIAJES OPERADORAS'
    },
    {
      id:1,
      name:'AGENCIA DE VIAJES Y DE TURISMO'
    },
    {
      id:1,
      name:'AGENCIA DE VIAJES MAYORISTAS'
    },
    {
      id:2,
      name:'COMERCIALIZADORA'
    },
    {
      id:2,
      name:'PROMOTORA'
    },
    {
      id:2,
      name:'PROMOTORA Y COMERCIALIZADORA'
    },
    {
      id:3,
      name: 'OPERADOR DE CHIVAS'
    },
    {
      id:3,
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
      id:5,
      name: 'RESTAURANTES'
    },
    {
      id:5,
      name: 'RESTAURANTES DE AUTOSERVICIOS'
    },
    {
      id:5,
      name: 'RESTAURANTES DE COMIDAS RAPIDAS'
    },
    {
      id:5,
      name: 'COMIDAS CALLEJERAS QUE SE ENCUENTRAN REGLAMENTADAS Y DEBIDAMENTE AUTORIZADAS POR LOS GOBIERNOS LOCALES'
    },
    {
      id:5,
      name: 'CAMIONES DE COMIDA DEBIDAMENTE AUTORIZADOS POR LA AUTORIDAD LOCAL'
    },
    {
      id:5,
      name: 'FRUTERIAS'
    },
    {
      id:5,
      name: 'HELADERIAS'
    },
    {
      id:5,
      name: 'SALSAMENTARIAS'
    },
    {
      id:5,
      name: 'PANADERIAS,REPOSTERIAS,PASTELERIAS O CHOCOLATERIAS'
    },
    {
      id:5,
      name: 'CAFES O CAFETERIAS'
    },
    {
      id:5,
      name: 'PIQUETEADEROS'
    },
    {
      id:5,
      name: 'CEVICHERIAS Y PESCADERIAS'
    },
    {
      id:5,
      name: 'BARES CON MUSICA EN VIVO'
    },
    {
      id:5,
      name: 'BARES SOCIALES'
    },
    {
      id:5,
      name: 'GASTROBARES'
    },
    {
      id:6,
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
