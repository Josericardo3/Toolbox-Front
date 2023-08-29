import { Component } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-monitorizacion',
  templateUrl: './app-monitorizacion.component.html',
  styleUrls: ['./app-monitorizacion.component.css']
})
export class AppMonitorizacionComponent {

  //SELECTOR MÚLTIPLE
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  //filtros multiple
  selectFiltros: any = {
    listaTipoPST: [],
    listaPST: [],
    listaGrupoPST: [],
    listaNorma: [],
    listaNumeralNorma: [],
    listaIndicador: []
  }
  //
  dropdownSettings: IDropdownSettings;
  dropdownSettingsNorma: IDropdownSettings;
  dropdownSettingsCategoryPST: IDropdownSettings;
  dropdownSettingsSubCategoryPST: IDropdownSettings;
  dropdownSettingsGroupListing: IDropdownSettings;
  searchText: string = '';
  dropdownListCategoryPST: any[] = [];
  dropdownListGroupListing: any[] = [];
  dropdownListSubCategoryPST: any[] = [];
  dropdownListNorma: any[] = [];
  selectedItemsNorma: any[] = [];
  rolesArray: any[] = [];
  pages = 1;
  dataInitial: any = [];
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  datatotal: number = 0;
  contentArray: any = [];
  currentPage: number = 1;
  dropdownListSubCategoryPSTfilter: any = [];

  constructor(private api: ApiService,) { }

  ngOnInit() {
    this.getMonitorizacion();
    this.dropdownSettingsCategory();
    this.getPSTSelect();
    this.getNormaSelect();
  }

  getMonitorizacion() {
    this.api.getMonitorizacion().subscribe((data: any) => {
      this.rolesArray = data;
      this.dataInitial = data;
      this.result = false;

      //paginado
      const totalPag = data.length;
      this.totalPaginas = Math.ceil(totalPag / 7);
      if (this.totalPaginas == 0) this.totalPaginas = 1;
      this.datatotal = this.dataInitial.length;
      this.rolesArray = this.dataInitial.slice(0, 7);
      this.contentArray = data;
      this.currentPage = 1
      if (this.datatotal >= 7) {
        this.totalRegistros = 7;
      } else {
        this.totalRegistros = this.dataInitial.length;
      }
    })
  }
  getPSTSelect() {
    this.api.getPSTSelect().subscribe((data: any) => {
      this.dropdownListGroupListing = data;
      this.dropdownListGroupListing = data.map(item => {
        return {
          id: item.ID_PST, // Campo único de cada elemento
          nombre: item.NOMBRE_PST // Campo que se mostrará en el dropdown
        };
      });
    })

    // Configura las opciones del dropdown
    this.dropdownSettingsGroupListing = {
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

  getNormaSelect() {
    this.api.getNormaSelect().subscribe((data: any) => {
      this.dropdownListNorma = data;
      this.dropdownListNorma = data.map(item => {
        return {
          id: item.ID_NORMA,
          nombre: item.NORMA
        };
      });
    })

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

  dropdownSettingsCategory() {
    this.api.getCategoriaSelect().subscribe((data: any) => {
      this.dropdownListCategoryPST = data;
      this.dropdownListCategoryPST = data.map(item => {
        return {
          id: item.ID_CATEGORIA_RNT,
          nombre: item.CATEGORIA_RNT
        };
      });

      //PARA ELIMINAR LOS DUPLICADOS  
      const listaSinDuplicados = this.eliminarDuplicados(this.dropdownListCategoryPST);
      this.dropdownListCategoryPST = listaSinDuplicados;
      this.dropdownListSubCategoryPST = data;
      this.dropdownListSubCategoryPST = data.map(item => {
        return {
          id: item.ID,
          categoria: item.CATEGORIA_RNT,
          nombre: item.SUB_CATEGORIA_RNT
        };
      });
    })

    // Configura las opciones del dropdown
    this.dropdownSettingsCategoryPST = {
      singleSelection: false,
      idField: 'id',
      textField: 'nombre',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      searchPlaceholderText: 'Buscar',
      itemsShowLimit: 100,
      allowSearchFilter: true
    };

    // Configura las opciones del dropdown
    this.dropdownSettingsSubCategoryPST = {
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

  eliminarDuplicados(lista) {
    const resultados = [];
    const idsYnombres = new Set();

    for (const objeto of lista) {
      const idYnombre = `${objeto.id}-${objeto.nombre}`;
      if (!idsYnombres.has(idYnombre)) {
        idsYnombres.add(idYnombre);
        resultados.push(objeto);
      }
    }

    return resultados;
  }

  updateCategory() {

    const filteredData = this.dropdownListSubCategoryPST.filter((item) => {
      const listaTipoPST = this.selectFiltros.listaTipoPST.some((filter) => filter.nombre.trim().toUpperCase() === item.categoria.trim().toUpperCase());
      return listaTipoPST
    })
    this.dropdownListSubCategoryPSTfilter = filteredData;
  }
  result: boolean = false;
  filtrado() {
    this.result = false;
    this.contentArray = [];
    const filteredData = this.dataInitial.filter((item) => {
      const listaTipoPST = this.selectFiltros.listaTipoPST.some((filter) => filter.nombre.trim().toUpperCase() === item.CATEGORIA_RNT.trim().toUpperCase());
      const subCategoria = this.selectFiltros.listaPST.some((filter) => filter.nombre.trim().toUpperCase() == item.SUB_CATEGORIA_RNT.trim().toUpperCase())
      const listaGrupoPST = this.selectFiltros.listaGrupoPST.some((filter) => filter.nombre.trim().toUpperCase() === item.NOMBRE_PST.trim().toUpperCase());
      return listaTipoPST || subCategoria || listaGrupoPST;
    });

    this.rolesArray = filteredData;

    ///para el paginado
    this.pages = 1;
    const totalPag = this.rolesArray.length;
    this.totalPaginas = Math.ceil(totalPag / 7);
    if (this.totalPaginas == 0) this.totalPaginas = 1;
    this.contentArray = this.rolesArray;
    this.totalRegistros = this.rolesArray.length;
    this.datatotal = this.rolesArray.length;
    if (this.totalRegistros == this.datatotal && this.totalRegistros >= 7) this.totalRegistros = 7;
    this.rolesArray = this.rolesArray.slice(0, 7);
    return this.rolesArray.length > 0 ? this.rolesArray : this.result = true;
  }

  onItemSelect(evt: any, dropdownId: string) {
    this.filtrado();
  }

  onDeSelect(item: any, dropdownId: string) {
    this.result = false;
    this.filtrado();
  }
  listaTipoPSTSelectAll: any;
  onSelectAll(items: any[], dropdownId: string) {
    if (dropdownId === 'categoryPST') {
      this.selectFiltros.listaTipoPST = items;
    }
    this.filtrado();
  }
  onDeSelectAll(items: any[], dropdownId: string) {
    this.filtrado();
  }

  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;


    if (this.selectFiltros.listaTipoPST.length || this.selectFiltros.listaPST.length || this.selectFiltros.listaGrupoPST.length > 0) {
      this.datatotal = this.contentArray.length;
      this.rolesArray = this.contentArray.slice(startItem, endItem)

    } else {
      this.datatotal = this.dataInitial.length;
      this.rolesArray = this.dataInitial.slice(startItem, endItem)
    }
    this.totalRegistros = this.rolesArray.length;
  }
}