import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/servicios/api/api.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AppMyExampleComponent } from '../../example/example';
import { debug, log } from 'console';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-app-gestor-noticia',
  templateUrl: './app-gestor-noticia.component.html',
  styleUrls: ['./app-gestor-noticia.component.css'],
  // encapsulation: ViewEncapsulation.None // Add this line
})
export class AppGestorNoticiaComponent implements OnInit {
  @ViewChild('archivo') archivo: ElementRef<HTMLInputElement>;

  imagen: any;
  imagenNoticia: any;
  showActividad: boolean = false;
  datosImagen: any[] = [];
  descripcion!: string;
  showModalNoticia = false;

  //paginación
  pages = 1;
  totalPaginas: number = 0;
  totalRegistros: number = 0;
  datatotal: number = 0;
  contentArray: any = [];
  currentPage: number = 1

  filtro: string = '';
  datos: any = [];
  delete: any = [];
  edicionIndices: number[] = [];
  mostrarModalEliminar = false;
  eliminarIndex: number;
  showModal = false;
  saveForm: FormGroup;
  showModalEditar = false;
  showModalLista = false;
  editarNoticiaForm: FormGroup;
  mostrarBuscador: boolean = false;
  busqueda: string = '';
  dataInitial: any = [];

  files: any = []
  valoresModal: any;
  tituloNoticia: string;
  descripcionNoticia: string;
  selectNorma: any;
  selectedNorma: number;
  indiceAEliminar: number = -1;
  valorRecibido = 0;
  caracteristicaIndiceEliminar: number = -1;
  caracteristicaIndice: number;
  noticiaIndice: number;
  editarCaracteristica: any = {};

  selectedAdmin: number[] = [];
  selectedNormas: number[] = [];
  selectedCategorias: number[] = [];
  selectedSubCategorias: number[] = [];
  selectedPst: number[] = [];

  //SELECTOR MÚLTIPLE
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: IDropdownSettings;
  searchText: string = '';

  dropdownListNorma: any[] = [];
  selectedItemsNorma: any[] = [];
  dropdownSettingsNorma: IDropdownSettings;

  dropdownListCategoria: any[] = [];
  selectedItemsCategoria: any[] = [];
  dropdownSettingsCategoria: IDropdownSettings;

  dropdownListSubCategoria: any[] = [];
  selectedItemsSubCategoria: any[] = [];
  dropdownSettingsSubCategoria: IDropdownSettings;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private Message: ModalService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.caracteristicaIndice = -1;

    this.getTableData();
    this.getSelectMultiplePST();
    this.getSelectMultipleNorma();
    this.getSelectMultipleCategoria();
    this.getSelectMultipleSubCategoria();

    this.editarNoticiaForm = this.formBuilder.group({
      usuario: [{ value: '', disabled: true }],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });

    this.saveForm = this.formBuilder.group({
      selectMultipleAdmin: ['', Validators.required],
      selectMultipleNorma: [[]],
      selectMultipleCategoria: [[]],
      selectMultipleSubCategoria: [[]],
      selectMultiplePST: ['', Validators.required],
      tituloNoticia: ['', Validators.required],
      descripcionNoticia: ['', Validators.required],
      imagenNoticia: [null, Validators.nullValidator]
    });
  }
  
  getTableData() {
    this.api.getTablaNoticias()
      .subscribe(data => {
        this.datos = data;
        this.filterArray = this.datos
        this.dataInitial = data;
        for (let i = 0; i < this.dataInitial.length; i++) {
          if (this.dataInitial[i].COD_IMAGEN != null || this.dataInitial[i].COD_IMAGEN != undefined) {
            this.imagenNoticia = 'data:image/png;base64,' + this.dataInitial[i].COD_IMAGEN
          } else {
            this.imagenNoticia = null
          }
        }

        //paginado
        const totalPag = data.length;
        this.totalPaginas = Math.ceil(totalPag / 7);
        if (this.totalPaginas == 0) this.totalPaginas = 1;

        this.datatotal = this.dataInitial.length;
        this.filterArray = this.dataInitial.slice(0, 7);
        this.contentArray = data;
        this.currentPage = 1
        if (this.datatotal >= 7) {
          this.totalRegistros = 7;
        } else {
          this.totalRegistros = this.dataInitial.length;
        }
      })
  }

  verImagen(imagenUrl: any) {
    const imagenDatos = this.dataInitial[imagenUrl].COD_IMAGEN;
    if (imagenDatos != null || imagenDatos != undefined) {
      const imagenConcat = 'data:image/png;base64,' + imagenDatos
      if (imagenConcat != null || imagenConcat != undefined) {
        var newWindow = window.open();
        var img = newWindow.document.createElement('img');
        img.src = imagenConcat;
        newWindow.document.body.appendChild(img);
      }
    }
    else {
      const title = "No se cargaron imágenes";
      const message = "No se puede visualizar"
      this.Message.showModal(title, message);
    }
  }

  eliminarNoticia(id: any) {
    this.indiceAEliminar = id;
    console.log(id)
  }

  recibirValor(valor: number) {
    this.valorRecibido = valor;
    this.caracteristicaIndiceEliminar = this.valorRecibido;
    if (valor == -2) this.getTableData();
  }

  fnEditar(index: number) {
    this.edicionIndices.push(index);
    this.caracteristicaIndice = index;
    this.noticiaIndice = index;
    this.caracteristicaIndiceEliminar = index;
    this.editarCaracteristica = {};
    Object.assign(this.editarCaracteristica,  this.filterArray[index]);
    this.editarCaracteristica.idUsuario = this.editarCaracteristica.idResponsable;
  }

  fnCancelar(index: number) {
    if (this.edicionIndices.includes(index)) {
      this.edicionIndices = this.edicionIndices.filter(i => i !== index);
    }
  }

  result: boolean = false;
  filterArray: any = [];
  filtrarDatos(){
    this.result = false;
    if (!this.busqueda) {
      this.datos = this.dataInitial;
      this.updatePaginado(this.dataInitial);
    }
    else {
      const terminoBusqueda = this.busqueda.toLowerCase();
      const filter = this.dataInitial.filter((campo: any) =>
        (campo.NOMBRE && campo.NOMBRE.toLowerCase().includes(terminoBusqueda)) ||
        (campo.NORMA && campo.NORMA.toLowerCase().includes(terminoBusqueda)) ||
        (campo.TITULO && campo.TITULO.toLowerCase().includes(terminoBusqueda)) ||
        (campo.DESCRIPCION && campo.DESCRIPCION.toLowerCase().includes(terminoBusqueda))
      );
      this.datos = filter;
      this.updatePaginado(filter);
      // Verificar si se encontraron resultados
      if (filter.length === 0) {
        this.result = true;
      }
    }
  }

  updatePaginado(filter: any) {
    ///para el paginado
    this.pages = 1;
    const totalPag = filter.length;
    this.totalPaginas = Math.ceil(totalPag / 7);
    if (this.totalPaginas == 0) this.totalPaginas = 1;
    this.contentArray = filter;
    this.totalRegistros = filter.length;
    this.datatotal = filter.length;
    if (this.totalRegistros == this.datatotal && this.totalRegistros >= 7) this.totalRegistros = 7;
    filter = filter.slice(0, 7);
    this.filterArray = filter;
    // return this.filterArray.length > 0 ? this.filterArray : this.result = true;
  }

  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;
    this.filterArray = this.datos.slice(startItem, endItem)
    this.totalRegistros = this.filterArray.length;
  }

  saveModal() {
    try {
      const id = localStorage.getItem('Id');
      const selectedNormas = this.selectedNormas;
      const selectedCategoria = this.selectedCategorias;
      const selectedSubCategoria = this.selectedSubCategorias;
      const destinatario = this.selectedAdmin.length > 0 ? this.selectedAdmin : this.selectedPst;
      const titulo = this.saveForm.value.tituloNoticia;
      const descripcion = this.saveForm.value.descripcionNoticia;
      const imagen = this.imagen ? this.imagen : '';

      const data = {
        FK_ID_USUARIO: id,
        FK_ID_NORMA: selectedNormas,
        FK_ID_CATEGORIA: selectedCategoria,
        FK_ID_SUB_CATEGORIA: selectedSubCategoria,
        FK_ID_DESTINATARIO: destinatario,
        TITULO: titulo,
        DESCRIPCION: descripcion,
        IMAGEN: imagen
      };
      var formData = new FormData();
      for (const key in data) {
        if (key != 'IMAGEN') {
          formData.append(key, data[key]);
        }
      }
      formData.append('FOTO', data.IMAGEN);
      this.saveForm.reset();
      this.cleanItemSelect();
      this.api.saveNoticia(formData).subscribe(
        (res) => {
          console.log('Carga exitosa');
          this.showModal = false;
          this.getTableData();
        },
        (error) => {
          console.error('Error al enviar la solicitud:', error);
        }
      );
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  cleanItemSelect() {
    this.selectedAdmin = [];
    this.selectedNormas = [];
    this.selectedCategorias = [];
    this.selectedSubCategorias = [];
    this.selectedPst = [];
    this.files = []
  }

  onItemSelect(item: any, dropdownId: string) {
    if (item && item.id && dropdownId === 'admin') {
      this.selectedAdmin.push(item.id);
      console.log(item, this.selectedAdmin)
    } else if (item && item.id && dropdownId === 'norma') {
      this.selectedNormas.push(item.id);
      console.log(item, this.selectedNormas)
    } else if (item && item.id && dropdownId === 'categoria') {
      this.selectedCategorias.push(item.id);
      console.log(item, this.selectedCategorias)
    } else if (item && item.id && dropdownId === 'subcategoria') {
      this.selectedSubCategorias.push(item.id);
      console.log(item, this.selectedSubCategorias)
    } else if (item && item.id && dropdownId === 'pst') {
      this.selectedPst.push(item.id);
      console.log(item, this.selectedPst)
    }
  }

  onSelectAll(items: any[], dropdownId: string) {
    if (dropdownId === 'admin') {
      this.selectedAdmin = items.map((item: any) => item.id);
      console.log(this.selectedAdmin)
    } else if (dropdownId === 'norma') {
      this.selectedNormas = items.map((item: any) => item.id);
      console.log(this.selectedNormas)
    } else if (dropdownId === 'categoria') {
      this.selectedCategorias = items.map((item: any) => item.id);
      console.log(this.selectedCategorias)
    } else if (dropdownId === 'subcategoria') {
      this.selectedSubCategorias = items.map((item: any) => item.id);
      console.log(this.selectedSubCategorias)
    } else if (dropdownId === 'pst') {
      this.selectedPst = items.map((item: any) => item.id);
      console.log(this.selectedPst)
    }
  }

  onDeSelect(item: any, dropdownId: string) {
    if (item && item.id && dropdownId === 'admin') {
      const index = this.selectedAdmin.indexOf(item.id);
      this.selectedAdmin.splice(index, 1);
    } else if (item && item.id && dropdownId === 'norma') {
      const index = this.selectedNormas.indexOf(item.id);
      this.selectedNormas.splice(index, 1);
    } else if (item && item.id && dropdownId === 'categoria') {
      const index = this.selectedCategorias.indexOf(item.id);
      this.selectedCategorias.splice(index, 1);
    } else if (item && item.id && dropdownId === 'subcategoria') {
      const index = this.selectedSubCategorias.indexOf(item.id);
      this.selectedSubCategorias.splice(index, 1);
    } else if (item && item.id && dropdownId === 'pst') {
      const index = this.selectedPst.indexOf(item.id);
      this.selectedPst.splice(index, 1);
    }
  }

  onDeSelectAll(items: any[], dropdownId: string) {
    if (dropdownId === 'admin') {
      this.selectedAdmin = [];
    } else if (dropdownId === 'norma') {
      this.selectedNormas = [];
    } else if (dropdownId === 'categoria') {
      this.selectedCategorias = [];
    } else if (dropdownId === 'subcategoria') {
      this.selectedSubCategorias = [];
    } else if (dropdownId === 'pst') {
      this.selectedPst = [];
    }
  }

  saveModalEditar() {
    const data = {
      ID_NOTICIA: this.editarCaracteristica.ID_NOTICIA,
      FK_ID_USUARIO: this.editarCaracteristica.FK_ID_USUARIO,
      TITULO: this.editarCaracteristica.TITULO,
      DESCRIPCION: this.editarCaracteristica.DESCRIPCION,
      IMAGEN: this.imagen
    }

    var formData = new FormData();
    for (const key in data) {
      if (key != 'IMAGEN') {
        formData.append(key, data[key]);
      }
    }
    formData.append('FOTO', data.IMAGEN);

    this.api.saveNoticiaEditar(formData)
      .subscribe(res => {
         this.filterArray[this.caracteristicaIndice].NOMBRE = this.editarCaracteristica.NOMBRE;
         this.filterArray[this.caracteristicaIndice].TITULO = this.editarCaracteristica.TITULO;
         this.filterArray[this.caracteristicaIndice].DESCRIPCION = this.editarCaracteristica.DESCRIPCION;
        this.showModalEditar = false;
        this.getTableData()
        this.fnCancelar(this.caracteristicaIndice);
      });
  }
  
  captureImage(event: any) {
    const archivoSeleccionado = this.archivo.nativeElement.files[0];
    const nombreArchivo = document.querySelector('#nombre') as HTMLElement;

    if (archivoSeleccionado) {
      const nombreArchivo = document.querySelector('#nombre') as HTMLElement;
      nombreArchivo.innerText = archivoSeleccionado.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.onload = () => {
          const maxWidth = 760; // Máximo ancho permitido
          const maxHeight = 760; // Máximo alto permitido
          let width = image.width;
          let height = image.height;

          // Verificar si se excede el ancho máximo
          if (width > maxWidth) {
            nombreArchivo.innerText = '';
            height *= maxWidth / width;
            width = maxWidth;
            const title = "Error de carga";
            const message = `Las dimensiones de la imagen no deben exceder el ancho máximo ${maxWidth} píxeles.`;
            this.Message.showModal(title, message);
            return;

          }

          // Verificar si se excede el alto máximo
          if (height > maxHeight) {
            nombreArchivo.innerText = '';
            width *= maxHeight / height;
            height = maxHeight;
            const title = "Error de carga";
            const message = `Las dimensiones de la imagen no deben exceder el alto máximo ${maxHeight} píxeles.`;
            this.Message.showModal(title, message);
            return;
          }

          // Crear un lienzo para dibujar la imagen con las dimensiones ajustadas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, width, height);

          // Obtener el archivo de imagen resultante
          canvas.toBlob((blob) => {
            const resizedImage = new File([blob], archivoSeleccionado.name, { type: blob.type });

            this.imagen = resizedImage;
            console.log(this.imagen);
            this.files.push(this.imagen);
            console.log(this.files);
          }, archivoSeleccionado.type);
        };

        image.src = e.target.result;
      };

      reader.readAsDataURL(archivoSeleccionado);
    } else {
      const nombreArchivo = document.querySelector('#nombre') as HTMLElement;
      nombreArchivo.innerText = '';
    }
  }

  getSelectMultiplePST() {
    this.api.getPSTSelect()
      .subscribe(data => {
        this.dropdownList = data;
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

  getSelectMultipleCategoria() {
    this.api.getCategoriaSelect()
      .subscribe(data => {
        this.dropdownListCategoria = data;
        this.dropdownListCategoria = data.map(item => {
          return {
            id: item.ID,
            nombre: item.CATEGORIA_RNT
          };
        });
      });
    this.dropdownSettingsCategoria = {
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

  getSelectMultipleSubCategoria() {
    this.api.getCategoriaSelect()
      .subscribe(data => {
        this.dropdownListSubCategoria = data;
        this.dropdownListSubCategoria = data.map(item => {
          return {
            id: item.ID,
            nombre: item.SUB_CATEGORIA_RNT
          };
        });
      });
    this.dropdownSettingsSubCategoria = {
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

  getRolValue(): number {
    // Obtener el valor del rol almacenado en el Local Storage
    const rol = localStorage.getItem('rol');

    // Verificar si el rol existe y es un número válido
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }

    // Valor predeterminado si no se encuentra el rol o no es un número válido
    return 0;
  }

  fnShowModal(index: number) {
    this.descripcion =  this.filterArray[index].DESCRIPCION;
    this.showModalNoticia = true;
  }

  getInnerText(html: string): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.innerText;
  }
}
