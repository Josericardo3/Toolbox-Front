import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as d3Tip from 'd3-tip';
import * as d3Geo from 'd3-geo';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-mapa-colombia',
  templateUrl: './app-mapa-colombia.component.html',
  styleUrls: ['./app-mapa-colombia.component.css']
})

export class AppMapaColombiaComponent implements OnInit{

//SELECTOR MÚLTIPLE
dropdownList: any[] = [];
selectedItems: any[] = [];
dropdownSettings: IDropdownSettings;
searchText: string = '';

dropdownListNorma: any[] = [];
selectedItemsNorma: any[] = [];
dropdownSettingsNorma: IDropdownSettings;

selectedAdmin: number[] = [];
selectedNormas: number[] = [];

constructor(private api: ApiService,) {}

ngOnInit() {
  this.dibujarMapa();    
  this.getSelectMultiplePST();
  this.getSelectMultipleNorma();
}

private dibujarMapa(): void {
  const width = window.innerWidth
  const height = window.innerHeight

  const svg = d3.select('#mapa-colombia')
    .attr('width', width)
    .attr('height', height);

  const projection = d3.geoMercator()
    .center([-74, 4])
    .scale(1900)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  d3.json('/assets/Colombia_departamentos_poblacion.geojson').then((data: any) => {
    svg.selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#ccc')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('mouseover', function () {
        d3.select(this)
          .attr('fill', 'orange');
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('fill', '#ccc');
      })
      .on('click', function (d: any) {
        console.log(d.properties.name); // Ejemplo: Muestra el nombre del departamento en la consola
      });
  });

    // Crea una instancia de d3-tip
    const tip = d3Tip.default()
.attr('class', 'd3-tip')
.html((d: any) => d.properties.name); // Cambia esto por la información que deseas mostrar

svg.call(tip);

d3.json('/assets/Colombia_departamentos_poblacion.geojson').then((data: any) => {
svg.selectAll('path')
  .data(data.features)
  .enter()
  .append('path')
  .attr('d', path)
  .attr('fill', '#ccc')
  .attr('stroke', '#fff')
  .attr('stroke-width', 0.5)
  .on('mouseover', function (d: any) {
    d3.select(this)
      .attr('fill', 'orange');
    tip.show(d, this); // Muestra el tooltip al pasar el cursor sobre un departamento
  })
  .on('mouseout', function () {
    d3.select(this)
      .attr('fill', '#ccc');
    tip.hide(); // Oculta el tooltip al quitar el cursor del departamento
  })
  .on('click', function (d: any) {
    console.log(d.properties.name); // Ejemplo: Muestra el nombre del departamento en la consola
  });
});
}

getSelectMultiplePST() {
  this.api.getPSTSelect()
    .subscribe(data => {
      this.dropdownList = data;
      console.log(data)
      this.dropdownList = data.map(item => {
        return {
          id: item.ID_USUARIO,
          nombre: item.NOMBRE
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
    itemsShowLimit: 100,
    allowSearchFilter: true
  };
}

getSelectMultipleNorma() {
  this.api.getNormaSelect()
    .subscribe(data => {
      this.dropdownListNorma = data;
      this.dropdownListNorma = data.map(item => {
        return {
          id: item.ID_NORMA, // Campo único de cada elemento
          nombre: item.NORMA // Campo que se mostrará en el dropdown
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
    itemsShowLimit: 100,
    allowSearchFilter: true
  };
}

onItemSelect(item: any, dropdownId: string) {
  if (item && item.id && dropdownId === 'pst') {
    this.selectedAdmin.push(item.id);
    console.log(item, this.selectedAdmin)
  } else if (item && item.id && dropdownId === 'norma') {
    this.selectedNormas.push(item.id);
    console.log(item, this.selectedNormas)
  }
}

onSelectAll(items: any[], dropdownId: string) {
  if (dropdownId === 'pst') {
    this.selectedAdmin = items.map((item: any) => item.id);
    console.log(this.selectedAdmin)
  } else if (dropdownId === 'norma') {
    this.selectedNormas = items.map((item: any) => item.id);
    console.log(this.selectedNormas)
  }
}

onDeSelect(item: any, dropdownId: string) {
  if (item && item.id && dropdownId === 'pst') {
    const index = this.selectedAdmin.indexOf(item.id);
    this.selectedAdmin.splice(index, 1);
  } else if (item && item.id && dropdownId === 'norma') {
    const index = this.selectedNormas.indexOf(item.id);
    this.selectedNormas.splice(index, 1);
  }
}

onDeSelectAll(items: any[], dropdownId: string) {
  if (dropdownId === 'pst') {
    this.selectedAdmin = [];
  } else if (dropdownId === 'norma') {
    this.selectedNormas = [];
  }
}

}