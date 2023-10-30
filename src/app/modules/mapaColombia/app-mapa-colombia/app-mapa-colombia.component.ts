import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as d3Tip from 'd3-tip';
import * as d3Geo from 'd3-geo';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiService } from 'src/app/servicios/api/api.service';

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

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.dibujarMapa();
    this.getSelectMultiplePST();
    this.getSelectMultipleNorma();
    this.listarCategorias();
  }

  getFillColor(depto: string): string {
    const firstLetter = depto.charAt(0).toLowerCase();
    if (firstLetter >= 'a' && firstLetter <= 'd') {
      return '#068460'; // Color para departamentos de la A a la D
    } else if (firstLetter >= 'e' && firstLetter <= 'm') {
      return '#FFA500'; // Color para departamentos de la E a la M
    } else if (firstLetter >= 'n' && firstLetter <= 'p') {
      return '#FFFF00'; // Color para departamentos de la N a la Z
    } else if ( firstLetter >= 'p' && firstLetter <= 'z') {
      return '#FF0000'; // Color por defecto para otros departamentos
    } else{
      return '';
    }
  }

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

    //PARA EL CUADRO INFORMATIVO(tooltip)
    let tip = d3Tip.default();

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
            console.log(d.properties.DPTO_CNMBR);
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
          { label: 'Bajo', color: '#FF0000', min: 0, max: 100 },
          { label: 'Medio', color: '#FFA500', min: 101, max: 500 },
          { label: 'Alto', color: '#FFFF00', min: 501, max: 1000 },
          { label: 'Muy Alto', color: '#068460', min: 1001, max: 2000 }
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
      itemsShowLimit: 100,
      allowSearchFilter: true,
    };
  }

  getSelectMultipleNorma() {
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
      itemsShowLimit: 100,
      allowSearchFilter: true,
    };
  }
  listarCategorias() {
    this.api.getListarCategoria().subscribe((data: any) => {
      this.arrayListaCategoria = data;
    })
  }

  onItemSelect(item: any, dropdownId: string) {
    if (item && item.id && dropdownId === 'pst') {
      this.selectedAdmin.push(item.id);
      console.log(item, this.selectedAdmin);
    } else if (item && item.id && dropdownId === 'norma') {
      this.selectedNormas.push(item.id);
      console.log(item, this.selectedNormas);
    }
    console.log(this.arrayListaCategoria);
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

  }

  onSelectAll(items: any[], dropdownId: string) {
    if (dropdownId === 'pst') {
      this.selectedAdmin = items.map((item: any) => item.id);
      console.log(this.selectedAdmin);
    } else if (dropdownId === 'norma') {
      this.selectedNormas = items.map((item: any) => item.id);
      console.log(this.selectedNormas);
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
