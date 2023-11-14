import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as d3Tip from 'd3-tip';
import * as d3Geo from 'd3-geo';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiService } from 'src/app/servicios/api/api.service';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import * as _ from 'lodash';
@Component({
  selector: 'app-app-mapa-colombia',
  templateUrl: './app-mapa-colombia.component.html',
  styleUrls: ['./app-mapa-colombia.component.css'],
})
export class AppMapaColombiaComponent implements OnInit {
  //SELECTOR MÚLTIPLE
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: IDropdownSettings;
  searchText: string = '';
  dropdownListCategoria: any[] = [];

  dropdownListNorma: any[] = [];
  selectedItemsNorma: any[] = [];
  dropdownSettingsNorma: IDropdownSettings;

  selectedAdmin: number[] = [];
  selectedNormas: number[] = [];
  arrayListaCategoria: any[] = [];
  datamapa: any;
  datamapafilter: any;
  showdepartamentoSeleccionado: boolean = false; 
  departamentoSeleccionado: string; 
  tarjetaTop: string = '0px';
  tarjetaLeft: string = '0px';
  booltest:boolean = false;
  valor1: any;
  valor2: any;
  valor3: any;
  valor4: any;
  valor5: any;
  dataInicial:any=[];
  constructor(private api: ApiService,
    private router: Router,) {}

  ngOnInit() {
    this.getDataMapa();
    //this.dibujarMapa();
    this.getSelectMultiplePST();
    this.getSelectMultipleNorma();
    this.listarCategorias();
  }
  getDataMapa(){
    this.api.getMonitorizacionMapa().subscribe((data)=>{

      this.datamapa = data;
      this.dataInicial = _.cloneDeep(data);
      this.datamapa.forEach((departamento) => {
        const sumaCantidades = departamento.PSTs.reduce((total, pst) => total + pst.CANTIDAD_CONEXIONES, 0);
        departamento.CANT = sumaCantidades;
      });
      this.dibujarMapa();
      return;
    });
  }

  getFillColor(depto: string): string {
   
    const departamento = this.datamapa?.find((data) => data.DEPARTAMENTO === depto);
   // this.datamapa = this.datamapa?.filter((data)=> data.CATEGORIA === )
    const cantidades = this.datamapa?.map((departamento) => departamento.CANT);

    if (departamento) {
      const cantidadConexiones = departamento.CANT;
  
      this.valor1 = Math.min(...cantidades);
      this.valor5 = Math.max(...cantidades);
      this.valor2 = (this.valor5 - this.valor1)/4+ this.valor1;
      this.valor3 = (this.valor5 - this.valor1)*2/4+ this.valor1;
      this.valor4 = (this.valor5 - this.valor1)*3/4+ this.valor1;

      this.valor1 = Math.round(this.valor1);
      this.valor2 = Math.round(this.valor2);
      this.valor3 = Math.round(this.valor3);
      this.valor4 = Math.round(this.valor4);
      this.valor5 = Math.round(this.valor5);
      var color;
        if (cantidadConexiones >= this.valor1 && cantidadConexiones < this.valor2) {
          color= '#FF0000'; 
        } else if (cantidadConexiones >= this.valor2 && cantidadConexiones < this.valor3) {
          color= '#FFA500'; 
        } else if (cantidadConexiones >= this.valor3 && cantidadConexiones < this.valor4) {
          color= '#FFFF00';
        } else if ( cantidadConexiones >= this.valor4 && cantidadConexiones <= this.valor5) {
          color= '#068460'; 
        } else{
          color= '#808080'; 
        }
        return color;

    }else{
      return '#808080';
    }

  }
nombreDepartamento: boolean = false; 
  dibujarMapa(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3
      .select('#mapa-colombia')
      .attr('width', width)
      .attr('height', height);

    const projection = d3
      .geoMercator()
      .center([-75, 4])
      .scale(1700)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);
    const mapaContainer = document.getElementById('mapa-colombia');
    const areaFueraDelMapa = document.getElementById('area-fuera-del-mapa');

  
    //PARA EL CUADRO INFORMATIVO(tooltip)
    let tip = d3Tip.default();
    var self = this;
    d3.json('/assets/Colombia_departamentos_poblacion.geojson').then(
      (data: any) => {
        // Crear la leyenda y otros elementos aquí...
        
        // ...

        const nombreDepartamentos = data.features.map(
          (d: any) => d.properties.DPTO_CNMBR
        );
        const colores = d3
          .scaleOrdinal()
          .domain(nombreDepartamentos)
          .range(nombreDepartamentos.map((depto) => this.getFillColor(depto)));

        svg
          .selectAll('path')
          .data(data.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', (d) => colores(d.properties.DPTO_CNMBR))
          .attr('stroke', '#fff')
          .attr('stroke-width', 0.5)
          .on('mouseover', function (event, d) {
          
            tip
              .attr('class', 'd3-tip')
              .html((d: any) => `<strong>${d.properties.DPTO_CNMBR}</strong>`);
            svg.call(tip);
            tip.show(d, this);

          })
          .on('mouseout', () => {
            tip.hide();
          })
          .on('click', function (event, d) {
            this.nombreDepartamento= false; 
            this.showdepartamentoSeleccionado = false;  
             if(d){
              this.nombreDepartamento= true; 
              this.showdepartamentoSeleccionado = true; 
              self.getTarjetaMapa(d.properties.DPTO_CNMBR);
             }
            const mapaContainer = d3.select('.mapa-container').node();
            const isClickInsideMap = mapaContainer.contains(event.target);
          });
          

        // Agregar etiquetas de texto con los nombres de los departamentos
   
        svg
          .selectAll('.departamento-label')
          .data(data.features)
          .enter()
          .append('text')
          .attr('class', 'departamento-label')
          .attr('x', (d) => path.centroid(d)[0])
          .attr('y', (d) => path.centroid(d)[1])
          .attr('text-anchor', 'middle')
          .text((d) => d.properties.DPTO_CNMBR.slice(0, 3))
          .style('font-size', '12px')
          .style('fill', 'black')
          .style('pointer-events', 'none');
        const legendData = [
          { label: 'Bajo', color: '#FF0000', min: this.valor1, max: this.valor2-1 },
          { label: 'Medio', color: '#FFA500', min: this.valor2, max: this.valor3-1 },
          { label: 'Alto', color: '#FFFF00', min: this.valor3, max: this.valor4-1 },
          { label: 'Muy Alto', color: '#068460', min: this.valor4, max: this.valor5 }
        ];
        this.dibujarLeyenda(legendData);
      }
    );
  }
  //inicio
  dibujarLeyenda(legendData) {
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const svg = d3
      .select('#mapa-colombia')
      .attr('width', width)
      .attr('height', height);
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 250}, ${height - 250})`);
  
    const legendItem = legend.selectAll('.legend-item')
      .data(legendData)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 30})`);
  
    legendItem.append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', d => d.color);
  
    legendItem.append('text')
      .attr('x', 30)
      .attr('y', 12)
      .style('font-size', '12px')
      .text(d => `${d.label}: ${d.min} - ${d.max}`);
  }
  
  
  //fin
  getSelectMultiplePST() {
    this.api.getPSTSelect().subscribe((data) => {
      this.dropdownList = data;
      this.dropdownList = data.map((item) => {
        return {
          id: item.ID_USUARIO,
          nombre: item.NOMBRE,
        };
      });
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nombre',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      searchPlaceholderText: 'Buscar',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  getSelectMultipleNorma() {
    this.datamapa=_.cloneDeep(this.dataInicial);
    this.api.getNormaSelect().subscribe((data) => {
      this.dropdownListNorma = data.filter((item, index, self) =>
        self.findIndex((i) => i.NORMA === item.NORMA) === index
      ).map((item) => {
        return {
          id: item.ID_NORMA,
          nombre: item.NORMA,
        };
      });
    });
    // Configura las opciones del dropdown
    this.dropdownSettingsNorma = {
      singleSelection: false,
      idField: 'id',
      textField: 'nombre',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      searchPlaceholderText: 'Buscar',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }
  listarCategorias() {
    this.api.getListarCategoria().subscribe((data: any) => {
      this.arrayListaCategoria = data;
    })
  }

  
  onItemSelect(item: any, dropdownId: string) {
    this.datamapa=_.cloneDeep(this.dataInicial);
    if (item && item.id && dropdownId === 'categoria') {
      this.selectedAdmin.push(item.id);

    } else if (item && item.id && dropdownId === 'norma') {
      this.selectedNormas.push(item.id);

    }
    
    const arrayFilter = this.arrayListaCategoria.filter((element: any) => {
      return element.ID_NORMAS.some((norma: any) => this.selectedNormas.includes(norma.ID_NORMA));
    });
    this.dropdownListCategoria = arrayFilter.map(item => {
      return {
        id: item.ID_CATEGORIA_RNT,
        nombre: item.CATEGORIA_RNT
      };
    });
 
     //para los repetidos solo mostrar uno
     const uniqueItems = this.dropdownListCategoria.reduce((accumulator, current) => {
      const exists = accumulator.some(item => item.nombre === current.nombre);
      if (!exists) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);
    this.dropdownListCategoria = uniqueItems;

    this.valor2 = 3; // Asegúrate de tener los nuevos datos

// 2. Limpia el mapa existente

//d3.select('#mapa-colombia').selectAll('*').remove();

// 3. Dibuja el mapa nuevamente
// Coloca aquí tu código para dibujar el mapa según los nuevos datos

// 4. Manejo de datos dinámicos
// Si tus datos cambian con el tiempo, puedes establecer un mecanismo para redibujar el mapa automáticamente.
// Por ejemplo, puedes usar un temporizador para verificar y actualizar los datos periódicamente.

this.filtrar(this.selectedNormas,this.selectedAdmin);
this.dibujarMapa(); // Una función que redibuja el mapa con los nuevos datos

  }
 filtrar(selectedNormas:any,selectedAdmin:any){
 
  d3.select('#mapa-colombia').selectAll('*').remove();
  var filtrado:any=[];
  const setFiltro = new Set(selectedNormas);
  this.datamapa.forEach(element => {
    element.PSTs.forEach(item => {
      // Filtrar las normas y asignar los resultados a un nuevo array
      item.NORMAS = item.NORMAS.filter(elemento => setFiltro.has(elemento.ID_NORMA));
    });
  });
  this.datamapa.forEach(element => {
   element.PSTs= element.PSTs.filter(x=>x.NORMAS.length>0);
  });
  this.datamapa=this.datamapa.filter(x=>x.PSTs.length>0);
  
  if(selectedAdmin.length>0){
  
    const setFiltroCat = new Set(selectedAdmin);
    this.datamapa.forEach(element => {
      element.PSTs=element.PSTs.filter(elemento => setFiltroCat.has(elemento.FK_ID_CATEGORIA_RNT));
    });
    this.datamapa=this.datamapa.filter(x=>x.PSTs.length>0);
    
  }

  this.datamapa.forEach((departamento) => {
    const sumaCantidades = departamento.PSTs.reduce((total, pst) => total + pst.CANTIDAD_CONEXIONES, 0);
    departamento.CANT = sumaCantidades;
  });
 }
  onSelectAll(items: any[], dropdownId: string) {
    this.datamapa=_.cloneDeep(this.dataInicial);
    if (dropdownId === 'categoria') {
      this.selectedAdmin = items.map((item: any) => item.id);

    } else if (dropdownId === 'norma') {
      this.selectedNormas = items.map((item: any) => item.id);

    }
    const arrayFilter = this.arrayListaCategoria.filter((element: any) => {
      return element.ID_NORMAS.some((norma: any) => this.selectedNormas.includes(norma.ID_NORMA));
    });
  
    this.dropdownListCategoria = arrayFilter.map(item => {
      return {
        id: item.ID_CATEGORIA_RNT,
        nombre: item.CATEGORIA_RNT
      };
    });

    const uniqueItems = this.dropdownListCategoria.reduce((accumulator, current) => {
      const exists = accumulator.some(item => item.nombre === current.nombre);
      if (!exists) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);

    this.dropdownListCategoria = uniqueItems;
    this.filtrar(this.selectedNormas,this.selectedAdmin );
    this.dibujarMapa();

  }

  onDeSelect(item: any, dropdownId: string) {
    this.datamapa=_.cloneDeep(this.dataInicial);
    if (item && item.id && dropdownId === 'categoria') {
      const index = this.selectedAdmin.indexOf(item.id);
      if (index !== -1) {
        this.selectedAdmin.splice(index, 1);
      }
    } else if (item && item.id && dropdownId === 'norma') {
      const index = this.selectedNormas.indexOf(item.id);
      if (index !== -1) {
        this.selectedNormas.splice(index, 1);
      }
      const arrayFilter = this.arrayListaCategoria.filter((element: any) => {
        return element.ID_NORMAS.some((norma: any) => this.selectedNormas.includes(norma.ID_NORMA));
      });
      
      this.dropdownListCategoria = arrayFilter.map(item => {
        return {
          id: item.ID_CATEGORIA_RNT,
          nombre: item.CATEGORIA_RNT
        };
      });

      const uniqueItems = this.dropdownListCategoria.reduce((accumulator, current) => {
        const exists = accumulator.some(item => item.nombre === current.nombre);
        if (!exists) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);

      this.dropdownListCategoria = uniqueItems;
      this.selectedItems = this.dropdownListCategoria.map(item => {
        return {
          id: item.id,
          nombre: item.nombre
        };
      });

    }
    if(this.selectedNormas.length>0){
      this.filtrar(this.selectedNormas,this.selectedAdmin );
      this.dibujarMapa();
    }else{
      d3.select('#mapa-colombia').selectAll('*').remove();

      this.datamapa.forEach((departamento) => {
        const sumaCantidades = departamento.PSTs.reduce((total, pst) => total + pst.CANTIDAD_CONEXIONES, 0);
        departamento.CANT = sumaCantidades;
      });
      this.dibujarMapa();
    }
  }
  
  /*
  onDeSelect(item: any, dropdownId: string) {
    if (item && item.id && dropdownId === 'categoria') {
      const index = this.selectedAdmin.indexOf(item.id);
      this.selectedAdmin.splice(index, 1);
    } else if (item && item.id && dropdownId === 'norma') {
      debugger;
      const index = this.selectedNormas.indexOf(item.id);
      this.selectedNormas.splice(index, 1);

    }
  }*/

  buscarRuta(ruta: string) {
    this.router.navigate([ruta]);
  }

  onDeSelectAll(items: any[], dropdownId: string) {
   this.datamapa=_.cloneDeep(this.dataInicial);
    if (dropdownId === 'categoria') {
      this.selectedAdmin = [];
    } else if (dropdownId === 'norma') {
      this.selectedNormas = [];
      this.selectedAdmin = [];
      this.dropdownListCategoria = [];
      this.selectedItems = [];

    }
    if(this.selectedNormas.length>0){
    this.filtrar(this.selectedNormas,this.selectedAdmin );
    }else{
      d3.select('#mapa-colombia').selectAll('*').remove();
      this.datamapa.forEach((departamento) => {
        const sumaCantidades = departamento.PSTs.reduce((total, pst) => total + pst.CANTIDAD_CONEXIONES, 0);
        departamento.CANT = sumaCantidades;
      });
    this.dibujarMapa();
    }
    
  }

  onMapClick(event: MouseEvent) {
    const mapaContainer = document.querySelector('.mapa-container-colombia') as HTMLElement;
    //   const x = event.clientX //- mapaContainer.getBoundingClientRect().left;
    //    const y = event.clientY - mapaContainer.getBoundingClientRect().top;
    if(this.showdepartamentoSeleccionado === true && this.nombreDepartamento == true  ){
      this.tarjetaTop = `${event.clientY}px`;
      this.tarjetaLeft = `${event.clientX}px`;  
    }
  }

  getTarjetaMapa(nameDpto : string){
    const dataSeleccionado = this.datamapa.find((data) => data.DEPARTAMENTO === nameDpto);
    this.datamapafilter = dataSeleccionado;
    if (dataSeleccionado) {
   this.showdepartamentoSeleccionado = true; 
   this.departamentoSeleccionado = nameDpto;
    } else{
      this.datamapafilter = {
        DEPARTAMENTO: nameDpto,
        PSTs:[
          {
            CANTIDAD_CONEXIONES:0
          }
        ]
      };
      this.departamentoSeleccionado = nameDpto;
      this.showdepartamentoSeleccionado = true; 

    }
  }

  cerrarTarjeta() {
    this.showdepartamentoSeleccionado = false;
    this.departamentoSeleccionado = '';

  }

}
