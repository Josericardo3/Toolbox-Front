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
        name:'GUIA DE TURISMO'
      },
      {
        id:2 ,
        name:'EMPRESA DE TRANSPORTE TERRESTRE AUTOMOTOR'
      },
      {
        id:3 ,
        name:'ESTABLECIMIENTOS DE GASTRONOMIA Y BARES TURISTICOS'
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
        id:7,
        name:'OPERADORES PROFESIONALES DE CONGRESOS, FERIAS Y CONVENCIONES'
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
        id_categoria:1,
        name: 'GUIA DE TURISMO'
      },
      {
        id:2,
        id_categoria:2,
        name: 'OPERADOR DE CHIVAS'
      },
      {
        id:3,
        id_categoria:2,
        name: 'TRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL'
      },
      {
        id:4,
        id_categoria:3,
        name: 'RESTAURANTES'
      },
      {
        id:5,
        id_categoria:3,
        name: 'RESTAURANTES DE AUTOSERVICIO'
      },
      {
        id:6,
        id_categoria:3,
        name: 'RESTAURANTES DE COMIDAS RAPIDAS'
      },
      {
        id:7,
        id_categoria:3,
        name: 'COMIDAS CALLEJERAS QUE SE ENCUENTRAN REGLAMENTADAS Y DEBIDAMENTE AUTORIZADAS POR LOS GOBIERNOS LOCALES'
      },
      {
        id:8,
        id_categoria:3,
        name: 'CAMIONES DE COMIDA DEBIDAMENTE AUTORIZADOS POR LA AUTORIDAD LOCAL'
      },
      {
        id:9,
        id_categoria:3,
        name: 'FRUTERIAS'
      },
      {
        id:10,
       id_categoria:3,
        name: 'HELADERIAS'
      },
      {
        id:11,
       id_categoria:3,
        name: 'SALSAMENTARIAS'
      },
      {
        id:12,
        id_categoria:3,
        name: 'PANADERIAS, REPOSTERIAS, PASTELERIAS O CHOCOLATERIAS'
      },
      {
        id:13,
        id_categoria:3,
        name: 'CAFES O CAFETERIAS'
      },
      {
        id:14,
        id_categoria:3,
        name: 'PIQUETEADEROS'
      },
      {
        id:15,
        id_categoria:3,
        name: 'CEVICHERIAS Y PESCADERIAS'
      },
      {
        id:16,
        id_categoria:3,
        name: 'BARES CON MUSICA EN VIVO'
      },
      {
        id:17,
        id_categoria:3,
        name: 'BARES SOCIALES'
      },
      {
        id:18,
        id_categoria:3,
        name: 'GASTROBARES'
      },
      {
        id:19,
        id_categoria:4,
        name: 'ALBERGUE'
      },
      {
        id:20,
        id_categoria:4,
        name: 'ALOJAMIENTO RURAL'
      },
      {
        id:21,
        id_categoria:4,
        name: 'APARTAHOTEL'
      },
      {
        id:22,
        id_categoria:4,
        name: 'CAMPAMENTO'
      },
      {
        id:23,
        id_categoria:4,
        name: 'CENTRO VACACIONAL'
      },
      {
        id:24,
        id_categoria:4,
        name: 'HOSTAL'
      },
      {
        id:25,
        id_categoria:4,
        name: 'HOTEL'
      },
      {
        id:26,
        id_categoria:4,
        name: 'REFUGIO'
      },
      {
        id:27,
        id_categoria:4,
        name: 'POSADAS TURISTICAS'
      },
      {
        id:28,
        id_categoria:4,
        name: 'GLAMPING'
      },
      {
        id:29,
        id_categoria:8,
        name: 'OTROS TIPOS DE ALOJAMIENTO NO PERMANENTES'
      },
      {
        id:30,
        id_categoria:9,
        name: 'APARTAMENTOS TURISTICOS'
      },
      {
        id:31,
        id_categoria:9,
        name: 'FINCAS TURISTICAS'
      },
      {
        id:32,
        id_categoria:9,
        name: 'OTRO TIPO DE VIVIENDA TURISTICA'
      },
    {
      id:33,
      id_categoria:5,
      name:'AGENCIA DE VIAJES OPERADORAS'
    },
    {
      id:34,
      id_categoria:5,
      name:'AGENCIA DE VIAJES Y DE TURISMO'
    },
    {
      id:35,
      id_categoria:5,
      name:'AGENCIA DE VIAJES MAYORISTAS'
    },
    {
      id:36,
      id_categoria:6,
      name:'COMERCIALIZADORA'
    },
    {
      id:37,
      id_categoria:6,
      name:'PROMOTORA'
    },
    {
      id:38,
      id_categoria:6,
      name:'PROMOTORA Y COMERCIALIZADORA'
    },
    {
      id:39,
      id_categoria:7,
      name: 'SIN CATEGORIA'
    },
  
    ],
  }
}
