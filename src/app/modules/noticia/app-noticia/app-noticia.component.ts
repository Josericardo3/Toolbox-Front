import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { DomSanitizer, SafeResourceUrl  } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-noticia',
  templateUrl: './app-noticia.component.html',
  styleUrls: ['./app-noticia.component.css']
})
export class AppNoticiaComponent implements OnInit {
  @ViewChild('archivo') archivo: ElementRef<HTMLInputElement>;
  dato!: string; 
  datosNoticia: any;
  idActividad: number;
  idNoticia: number;
  imagen: any;
  showModalEditar = false;
  editarNoticiaForm: FormGroup;
  files: any = [];
  datos: any=[];
  noticiaSelected: any={};
  arrayCategorias: any = [];

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private Message: ModalService,
    private router: Router,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.editarNoticiaForm = this.formBuilder.group({
      usuario: [{ value: '', disabled: true }],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.dato = history.state.dato;
    this.idNoticia = history.state.idNoticiaa;
    console.log(this.idNoticia);
    this.getTableData();
    this.idActividad = history.state.idActividad;
    if (this.dato == 'Noticia' && this.idNoticia != undefined ) {
      //this.getDataNoticia();
    }
    if (this.dato == 'Actividad' && this.idActividad != undefined ) {
      this.getDataActividad();
    }
  }
  getListCategorias(){
    this.api.getNoticiaCategorias().subscribe(data => {
      this.arrayCategorias=data;
      this.updateContadorCategorias();
      console.log(this.arrayCategorias);
    });
  }
  updateContadorCategorias(){
    this.arrayCategorias.forEach(val=>{
      let i=0;
      if(this.noticiaSelected.FK_ID_CATEGORIAAA==val.ID_CATEGORIA){
        i++;
      }
      val.N_REGISTROS=i;
    })
  }
  getTableData() {
    this.api.getTablaNoticias()
      .subscribe(data => {
        this.datos = data;
        this.datos.forEach(val=>{
          if(val.ID_NOTICIA == this.idNoticia)
          this.noticiaSelected = val;
        })
        console.log(this.noticiaSelected.DESCRIPCION);
        this.imagen = this.noticiaSelected.COD_IMAGEN ? 'data:image/png;base64,' + this.noticiaSelected.COD_IMAGEN : '';
        
        //
        //console.log(this.procesarHTML(this.noticiaSelected.DESCRIPCION));
        this.procesarHTML(this.noticiaSelected.DESCRIPCION);
        //
        this.getListCategorias();
        console.log(this.noticiaSelected);
      })
  }
  secureUrlYT: string;

  procesarHTML(htmlString: string): string {
    const safeHtml = htmlString.replace(/<iframe\s[^>]*src="([^"]+)"[^>]*>/gi, (match, src) => {
      const safeSrc = `this.sanitizer.bypassSecurityTrustResourceUrl('${src}')\" width="560" height="314" allowfullscreen="allowfullscreen`;
      this.secureUrlYT=src;
      return `<iframe [src]="${safeSrc}">`;
    });
    return safeHtml;
  }
  getRolValue(): number {
    const rol = localStorage.getItem('rol');
    if (rol && !isNaN(Number(rol))) {
      return Number(rol);
    }
    return 0;
  }
  deleteNoticia(){
    this.api.deleteNoticia(this.noticiaSelected.ID_NOTICIA)
      .subscribe(res => {
        const title = "Noticia Eliminada";
        const message = "Noticia eliminada exitosamente";
        this.Message.showModal(title, message);
        this.router.navigate(['/gestorNoticia'], { });
      })
  }
  saveModalEditar() {
    //this.noticiaSelected.DESCRIPCION=this.editarNoticiaForm.value.descripcion;
    const data = {
      ID_NOTICIA: this.noticiaSelected.ID_NOTICIA,
      FK_ID_USUARIO: this.noticiaSelected.FK_ID_USUARIO,
      TITULO: this.noticiaSelected.TITULO,
      DESCRIPCION: this.noticiaSelected.DESCRIPCION,
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
        //this.filterArray[this.caracteristicaIndice].NOMBRE = this.editarCaracteristica.NOMBRE;
        //this.filterArray[this.caracteristicaIndice].TITULO = this.editarCaracteristica.TITULO;
        //this.filterArray[this.caracteristicaIndice].DESCRIPCION = this.editarCaracteristica.DESCRIPCION;
        this.showModalEditar = false;
        const title = "Noticia Editada";
        const message = "Noticia editada exitosamente";

        this.Message.showModal(title, message);
        this.getTableData()
        //this.fnCancelar(this.caracteristicaIndice);
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

  getDataNoticia(){
    debugger;
    this.api.getNoticiaCompleta(this.idNoticia)
      .subscribe(data => {
        this.datosNoticia = data;
        this.imagen = this.datosNoticia.COD_IMAGEN ? 'data:image/png;base64,' + this.datosNoticia.COD_IMAGEN : '';
        console.log(this.imagen);
      })
  }

  getDataActividad() {
    this.api.getActivitiesCompleta(this.idActividad)
      .subscribe(data => {
        console.log(data)
      })
  }
}