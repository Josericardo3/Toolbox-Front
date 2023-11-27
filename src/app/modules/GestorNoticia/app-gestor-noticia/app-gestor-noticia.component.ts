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
import { ColorLista } from 'src/app/servicios/api/models/color';
import { Router } from '@angular/router';
import { forEach } from 'lodash';

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
  arrayCategorias: any = [];
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
  dataContador: any = [];
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
  CategoriaNoticia: number;
  selectedAdmin: number[] = [];
  selectedNormas: number[] = [];
  selectedCategorias: number[] = [];
  selectedSubCategorias: number[] = [];
  selectedPst: number[] = [];
  result: boolean = false;
  filterArray: any = [];

  //SELECTOR MÚLTIPLE
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: IDropdownSettings;
  searchText: string = '';


  dropdownListPst: any[] = [];
  selectedItemsPst: any[] = [];
  dropdownSettingsPst: IDropdownSettings;

  dropdownListNorma: any[] = [];
  selectedItemsNorma: any[] = [];
  dropdownSettingsNorma: IDropdownSettings;

  dropdownListCategoria: any[] = [];
  selectedItemsCategoria: any[] = [];
  dropdownSettingsCategoria: IDropdownSettings;

  dropdownListSubCategoria: any[] = [];
  selectedItemsSubCategoria: any[] = [];
  dropdownSettingsSubCategoria: IDropdownSettings;
  colorWallpaper: ColorLista;
  colorTitle: ColorLista;
  arrayLista: any[] = [];
  arrayListaPst: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private Message: ModalService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.api.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;

    this.caracteristicaIndice = -1;
    this.getTableData();
    this.getSelectMultiplePST();
    this.getSelectMultipleColaboradores();
    this.getSelectMultipleNorma();
    this.getSelectMultipleCategoria();
    this.getSelectMultipleSubCategoria();
    this.listarCategorias();
    this.listarPst();
    this.getListCategorias();

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
      CategoriaNoticia: ['', Validators.required],
      descripcionNoticia: ['', Validators.required],
      imagenNoticia: [null, Validators.nullValidator]
    });
  }
  getListCategorias(){
    this.api.getNoticiaCategorias().subscribe(data => {
      this.arrayCategorias=data;
      this.updateContadorCategorias();
    });
  }
  formatFechaText(fecha: string): string {
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
  
    const fechaOriginal = new Date(fecha);
    const dia = fechaOriginal.getDate();
    const mes = meses[fechaOriginal.getMonth()];
    const año = fechaOriginal.getFullYear();
  
    const fechaFormateada = `${dia} de ${mes} del ${año}`;
  
    return fechaFormateada;
  }
  updateContadorCategorias(){
    this.arrayCategorias.forEach(val=>{
      let i=0;
      this.dataContador.forEach(v=>{
        if(v.FK_ID_CATEGORIAAA==val.ID_CATEGORIA){
          i++;
        }
      })
      val.N_REGISTROS=i;
    })
  }
  
  idNoticia!: number;
  
  indexCard(val: any){
    this.idNoticia = val;
    this.router.navigate(['/noticia'], { state: { idNoticiaa: this.idNoticia } });
  }
  getTableData() {
    this.api.getTablaNoticias()
      .subscribe(data => {
        this.datos = data;
        this.dataContador = data;
        this.filterArray = this.datos;
        console.log(this.filterArray);
        this.dataInitial = data;
        this.getListCategorias();
        this.updateContadorCategorias();
        this.filterArray.forEach(val=>{
          val.RUTA_IMAGEN = 'data:image/png;base64,' + val.COD_IMAGEN;
        })
        console.log(this.filterArray);
        for (let i = 0; i < this.dataInitial.length; i++) {
          if (this.dataInitial[i].COD_IMAGEN != null || this.dataInitial[i].COD_IMAGEN != undefined) {
            this.imagenNoticia = 'data:image/png;base64,' + this.dataInitial[i].COD_IMAGEN
          } else {
            this.imagenNoticia = null
          }
        }
        //paginado
        const totalPag = data.length;
        this.totalPaginas = Math.ceil(totalPag / 6);
        if (this.totalPaginas == 0) this.totalPaginas = 1;

        this.datatotal = this.dataInitial.length;
        this.filterArray = this.dataInitial.slice(0, 6);
        this.contentArray = data;
        this.currentPage = 1
        if (this.datatotal >= 6) {
          this.totalRegistros = 6;
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
    Object.assign(this.editarCaracteristica, this.filterArray[index]);
    this.editarCaracteristica.idUsuario = this.editarCaracteristica.idResponsable;
  }

  fnCancelar(index: number) {
    if (this.edicionIndices.includes(index)) {
      this.edicionIndices = this.edicionIndices.filter(i => i !== index);
    }
  }

  descripcionNormas: any;
  datosIndexListaDestinatario: any = [];
  datosLista: any;
  fnShowModalLista(index: number) {
    this.datosIndexListaDestinatario = [];
    let IdTipoUsuario = Number(localStorage.getItem('rol'));
    this.showModalLista = true;

    if (IdTipoUsuario == 4 || 3) {
      this.datosIndexListaDestinatario.push(this.datos[index]);
      const listaTempo = this.datosIndexListaDestinatario.map((elemento) => {
        return {
          NOMBRE_DESTINATARIO: elemento.NOMBRE_DESTINATARIO,
          CATEGORIAS: elemento.CATEGORIAS,
          SUB_CATEGORIAS: elemento.SUB_CATEGORIAS
        }
      })
      this.datosLista = listaTempo;

      this.descripcionNormas = this.datos[index].NORMAS;
      const tempo = this.descripcionNormas.split(', ');

      const arrayConNorma = tempo.map((elemento) => {
        return { NORMA: elemento };
      });
      this.descripcionNormas = arrayConNorma;
    }
    else {

      const nombreLista = this.datos[index].NOMBRE_DESTINATARIO;
      const tempo = nombreLista?.split(', ');

      if (tempo) {
        const arrayConNorma = tempo.map((elemento) => {
          return { NOMBRE_DESTINATARIO: elemento };
        });
        this.datosLista = arrayConNorma;
      }
    }

  }

  filtrarDatos() {
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
    this.totalPaginas = Math.ceil(totalPag / 6);
    if (this.totalPaginas == 0) this.totalPaginas = 1;
    this.contentArray = filter;
    this.totalRegistros = filter.length;
    this.datatotal = filter.length;
    if (this.totalRegistros == this.datatotal && this.totalRegistros >= 6) this.totalRegistros = 6;
    filter = filter.slice(0, 6);
    this.filterArray = filter;
    // return this.filterArray.length > 0 ? this.filterArray : this.result = true;
  }

  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    console.log(startItem);
    const endItem = event.page * event.itemsPerPage;
    console.log(endItem);
    this.filterArray = this.datos.slice(startItem, endItem)
    this.totalRegistros = this.filterArray.length;
  }

  recibirNoticias: boolean = false;
  onChangeCheckbox(event: any) {
    this.recibirNoticias = event.target.checked;
  }
  ejemplo: any;
  ejemplooo(){
    console.log(this.saveForm.value.descripcionNoticia);
    console.log(this.ejemplo);
  }
  saveModal() {
   try {
      const id = localStorage.getItem('Id');
      const selectedNormas = this.selectedNormas;
      const selectedCategoria = this.selectedCategorias;
      const selectedSubCategoria = this.selectedSubCategorias;
      const destinatario = this.selectedPst;
      const destinatariopst = this.selectedAdmin;
      const titulo = this.saveForm.value.tituloNoticia;
      //const descripcion = this.sanitizer.bypassSecurityTrustHtml(this.saveForm.value.descripcionNoticia); 
      const descripcion = this.saveForm.value.descripcionNoticia; 

      const imagen = this.imagen ? this.imagen : '';
      const id_categoria = this.saveForm.value.CategoriaNoticia;
      const data = {
        FK_ID_USUARIO: id,
        FK_ID_NORMA: selectedNormas,
        FK_ID_CATEGORIA: selectedCategoria,
        FK_ID_SUB_CATEGORIA: selectedSubCategoria,
        FK_ID_DESTINATARIO: destinatario,
        FK_ID_PST_DESTINATARIO : destinatariopst,
        TITULO: titulo,
        DESCRIPCION: descripcion,
        IMAGEN: imagen,
        FK_ID_CATEGORIAAA: id_categoria,
        ENVIO_CORREO: this.recibirNoticias
      };
      console.log ("GIAN NOTICIA: ", data)
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
          this.showModal = false;

          const title = "Noticia creada";
          const message = "Noticia creada exitosamente";

          this.Message.showModal(title, message);
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

  listarCategorias() {
    this.api.getListarCategoria().subscribe((data: any) => {
      this.arrayLista = data;
    })
  }

  listarPst() {
    this.api.getListarPst().subscribe((data: any) => {
      this.arrayListaPst = data;
    })
  }

  onItemSelect(item: any, dropdownId: string) {
    if (item && item.id && dropdownId === 'admin') {
      this.selectedAdmin.push(item.id);

    } else if (item && item.id && dropdownId === 'norma') {
      this.selectedNormas.push(item.id);

      const arrayFilter = this.arrayLista.filter((element: any) => {
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

      ///SUBCATEGORIA

      this.dropdownListSubCategoria = arrayFilter.map(item => {
        return {
          id: item.ID_CATEGORIA_RNT,
          nombre: item.SUB_CATEGORIA_RNT
        };
      });

   
      /// PST

      const arrayFilterPst = this.arrayListaPst.filter((element: any) => {
        return element.ID_NORMAS.some((pst: any) => this.selectedNormas.includes(pst));
      });
    
      
      this.dropdownListPst = arrayFilterPst.map(item => {
        return {
          id: item.ID_PST,
          nombre: item.NOMBRE_PST
        };
      });

    } else if (item && item.id && dropdownId === 'categoria') {
      this.selectedCategorias.push(item.id);

    } else if (item && item.id && dropdownId === 'subcategoria') {
      this.selectedSubCategorias.push(item.id);

    } else if (item && item.id && dropdownId === 'pst') {
      this.selectedPst.push(item.id);

    }
  }

  onSelectAll(items: any[], dropdownId: string) {
    if (dropdownId === 'admin') {
      this.selectedAdmin = items.map((item: any) => item.id);

    } else if (dropdownId === 'norma') {
      this.selectedNormas = items.map((item: any) => item.id);

      const arrayFilter = this.arrayLista.filter((element: any) => {
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

      // SUBCATEGORIA
      this.dropdownListSubCategoria = arrayFilter.map(item => {
        return {
          id: item.ID_CATEGORIA_RNT,
          nombre: item.SUB_CATEGORIA_RNT
        };
      });

   /// PST

   const arrayFilterPst = this.arrayListaPst.filter((element: any) => {
    return element.ID_NORMAS.some((pst: any) => this.selectedNormas.includes(pst));
  });

  
  this.dropdownListPst = arrayFilterPst.map(item => {
    return {
      id: item.ID_PST,
      nombre: item.NOMBRE_PST
    };
  });  
    
    } else if (dropdownId === 'categoria') {
      this.selectedCategorias = items.map((item: any) => item.id);

    } else if (dropdownId === 'subcategoria') {
      this.selectedSubCategorias = items.map((item: any) => item.id);

    } else if (dropdownId === 'pst') {
      this.selectedPst = items.map((item: any) => item.id);

    }
  }

  onDeSelect(item: any, dropdownId: string) {
    if (item && item.id && dropdownId === 'admin') {
      const index = this.selectedAdmin.indexOf(item.id);
      this.selectedAdmin.splice(index, 1);
    } else if (item && item.id && dropdownId === 'norma') {
      
      const index = this.selectedNormas.indexOf(item.id);
      this.selectedNormas.splice(index, 1);
      const arrayFilter = this.arrayLista.filter((element: any) => {
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

      ///SUBCATEGORIA

      this.dropdownListSubCategoria = arrayFilter.map(item => {
        return {
          id: item.ID_CATEGORIA_RNT,
          nombre: item.SUB_CATEGORIA_RNT
        };
      });

   
      /// PST

      const arrayFilterPst = this.arrayListaPst.filter((element: any) => {
        return element.ID_NORMAS.some((pst: any) => this.selectedNormas.includes(pst));
      });

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
      this.saveForm.get('selectMultipleCategoria').reset([]); // Reinicia a un arreglo vacío
      this.saveForm.get('selectMultipleSubCategoria').reset([]);
      this.saveForm.get('selectMultipleAdmin').reset([]);
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

            this.files.push(this.imagen);

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
        // this.dropdownListPst = data;
      });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nombre',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      searchPlaceholderText: 'Buscar',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }

  getSelectMultipleColaboradores() {
    this.api.getListResponsible()
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
      itemsShowLimit: 2,
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
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }

  getSelectMultipleCategoria() {
    this.api.getCategoriaSelect()
      .subscribe(data => {
        //   this.dropdownListCategoria = data;
        //   this.dropdownListCategoria = data.map(item => {
        //     return {
        //       id: item.ID,
        //       nombre: item.CATEGORIA_RNT
        //     };
        //   });
      });
    this.dropdownSettingsCategoria = {
      singleSelection: false,
      idField: 'id',
      textField: 'nombre',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      searchPlaceholderText: 'Buscar',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }

  getSelectMultipleSubCategoria() {
    this.api.getCategoriaSelect()
      .subscribe(data => {
        // this.dropdownListSubCategoria = data;
        // this.dropdownListSubCategoria = data.map(item => {
        //   return {
        //     id: item.ID,
        //     nombre: item.SUB_CATEGORIA_RNT
        //   };
        // });
      });
    this.dropdownSettingsSubCategoria = {
      singleSelection: false,
      idField: 'id',
      textField: 'nombre',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      searchPlaceholderText: 'Buscar',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }

  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }

  fnShowModal(index: number) {
    this.descripcion = this.filterArray[index].DESCRIPCION;
    this.showModalNoticia = true;
  }

  getInnerText(html: string): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.innerText;
  }

}
