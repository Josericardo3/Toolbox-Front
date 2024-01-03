import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { filter } from 'rxjs/operators';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';
import { ApiService } from 'src/app/servicios/api/api.service';
import { FormControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-diagrama-proceso',
  templateUrl: './diagrama-proceso.component.html',
  styleUrls: ['./diagrama-proceso.component.css'],
})
export class DiagramaProcesoComponent {
  esTelefono = false;
  @Input() esNuevo = false;
  model: any = {};
  contenidoDivEditable: any;
  filter: any = { Search: '' };
  @ViewChild('divEditable', { static: true }) divEditable!: ElementRef;
  tipoFilterCtrl: FormControl = new FormControl();
  selectedElement: string = 'boton'; // Elemento predeterminado
  listNumbers1: any = [];
  listNumbers2: any = [];
  listNumbers3: any = [];
  listNumbers4: any = [];
  listNumbers21: any = [];
  listNumbers31: any = [];
  listNumbers41: any = [];
  filterProcesos: any = [];
  filterProcesosGroup: any = [];
  dataProcesos: any = [];
  lista: any = [];
  procesosMisionales = [];
  procesosEstrategicos = [];
  procesosApoyo = [];
  procesosMisionalesfilter: any = [];
  procesosEstrategicosfilter: any = [];
  procesosApoyofilter: any = [];
  todosProcesos: any = [];
  elementoEliminar: any = {};

  @ViewChild('contentToConvert') contentToConvert!: ElementRef;
  constructor(
    private api: ApiService,
    private breakpointObserver: BreakpointObserver,
    private Message: ModalService
  ) {}

  ngOnInit() {
    this.verificarTamañoPantalla();
    this.listNumbers4 = [];
    this.getDataProceso();
    this.obtenergrafico();
  }
  obtenergrafico() {
    this.api.obtenerDiagramaMapaProceso(this.filter).subscribe({
      next: (x) => {
        if (x.Confirmacion) {
          this.listNumbers2 = x.ESTRATEGICOS;
          this.listNumbers3 = x.MISIONALES;
          this.listNumbers4 = x.APOYO;
          if (this.listNumbers2 != null) {
            this.listNumbers21 = [...this.listNumbers2];
          } else {
            this.listNumbers2 = [];
            this.listNumbers21 = [];
          }
          if (this.listNumbers3 != null) {
            this.listNumbers31 = [...this.listNumbers3];
          } else {
            this.listNumbers3 = [];
            this.listNumbers31 = [];
          }
          if (this.listNumbers4 != null) {
            this.listNumbers41 = [...this.listNumbers4];
          } else {
            this.listNumbers4 = [];
            this.listNumbers41 = [];
          }
        } else {
        }
      },
      error: (e) => {},
    });
  }
  verificarTamañoPantalla(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.esTelefono = result.matches;
      });
  }
  getDataProceso() {
    this.api.getDataProceso().subscribe((response: any) => {
      if (response.length > 0) {
        this.dataProcesos = response;
        this.filterProcesos = response;
        this.procesosMisionales = response.filter(
          (item) => item.TIPO_PROCESO === 'Procesos Misionales'
        );
        // Estrategicos
        this.procesosEstrategicos = response.filter(
          (item) => item.TIPO_PROCESO === 'Procesos Estratégicos'
        );
        // Apoyo soporte
        this.procesosApoyo = response.filter(
          (item) => item.TIPO_PROCESO === 'Procesos Soporte'
        );

        this.todosProcesos = [
          {
            nombre: 'Procesos Estratégicos',
            procesos: this.procesosEstrategicos,
          },
          { nombre: 'Procesos Misionales', procesos: this.procesosMisionales },
          { nombre: 'Procesos Soporte', procesos: this.procesosApoyo },
        ];
        this.filterProcesosGroup = [
          {
            nombre: 'Procesos Estratégicos',
            procesos: this.procesosEstrategicos,
          },
          { nombre: 'Procesos Misionales', procesos: this.procesosMisionales },
          { nombre: 'Procesos Soporte', procesos: this.procesosApoyo },
        ];
      }
    });
  }
  generarPDF() {
    var modelEnvio: any = {};

    modelEnvio.PROCESOS_DIAGRAMA = {
      ESTRATEGICOS: this.listNumbers2,
      MISIONALES: this.listNumbers3,
      APOYO: this.listNumbers4,
    };
    var existeCambios = false;

    this.listNumbers2.forEach((element) => {
      if (element.ID_DETALLE == 0) {
        existeCambios = true;
      }
    });
    this.listNumbers3.forEach((element) => {
      if (element.ID_DETALLE == 0) {
        existeCambios = true;
      }
    });
    this.listNumbers4.forEach((element) => {
      if (element.ID_DETALLE == 0) {
        existeCambios = true;
      }
    });
    if (existeCambios) {
      this.api.postDiagramaMapaProceso(modelEnvio).subscribe({
        next: (x) => {
          if (x.Confirmacion) {
            this.obtenergrafico();
            const title = 'Correcto';
            const message =
              'Ya se encuentra registrado el proceso seleccionado';
            this.Message.showModal(title, x.Mensaje);
          } else {
            const title = 'Alerta';

            this.Message.showModal(title, x.Mensaje);
          }
        },
        error: (e) => {
          const title = 'Alerta';

          this.Message.showModal(title, 'Algo Salió Mal');
        },
      });
    }

    let chartContent = this.contentToConvert.nativeElement;

    html2canvas(chartContent).then((canvas) => {
      let img: any = new Image();
      img.src = canvas.toDataURL('image/jpeg');
      img.onload = () => {
        if (this.esTelefono) {
          const resizedImageData = this.redimensionarImagen(
            img.src,
            1080,
            1520
          );
          this.agregarImagenAlPDF(resizedImageData);
        } else {
          this.agregarImagenAlPDF(img.src);
        }
      };
    });
  }

  redimensionarImagen(
    imageData: string,
    newWidth: number,
    newHeight: number
  ): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = imageData;

    // Configurar el nuevo tamaño del canvas
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Dibujar la imagen redimensionada en el canvas
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    // Obtener la nueva imagen redimensionada en formato base64
    return canvas.toDataURL('image/jpeg');
  }
  agregarImagenAlPDF(imageData: string) {
    const pdfDefinition: any = {
      content: [
        {
          text: 'MAPA DE PROCESOS',
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        { image: imageData, width: 500 },
      ],
    };

    pdfMake.createPdf(pdfDefinition).getBlob((blob) => {
      // Crear un objeto URL con el blob
      const blobUrl = URL.createObjectURL(blob);

      // Abrir una nueva pestaña con el objeto URL
      window.open(blobUrl, '_blank');
    });
  }

  onSearchInputChange(opcion: number, event: any) {
    switch (opcion) {
      case 1:
        this.filterProcesos = this.dataProcesos.filter(
          (bank: any) =>
            bank.DESCRIPCION_PROCESO.toLowerCase().indexOf(event) > -1
        );

        break;
      case 2:
        this.procesosMisionalesfilter = this.procesosMisionales.filter(
          (bank: any) =>
            bank.DESCRIPCION_PROCESO.toLowerCase().indexOf(event) > -1
        );
        // Estrategicos
        this.procesosEstrategicosfilter = this.procesosEstrategicos.filter(
          (bank: any) =>
            bank.DESCRIPCION_PROCESO.toLowerCase().indexOf(event) > -1
        );
        // Apoyo soporte
        this.procesosApoyofilter = this.procesosApoyo.filter(
          (bank: any) =>
            bank.DESCRIPCION_PROCESO.toLowerCase().indexOf(event) > -1
        );

        this.filterProcesosGroup = [
          {
            nombre: 'Procesos Estratégicos',
            procesos: this.procesosEstrategicosfilter,
          },
          {
            nombre: 'Procesos Misionales',
            procesos: this.procesosMisionalesfilter,
          },
          { nombre: 'Procesos Soporte', procesos: this.procesosApoyofilter },
        ];
        break;

      default:
        break;
    }
  }
  cambio(event: any) {
    this.Message.hideModal();

    this.listNumbers1 = [];
    this.listNumbers1 = [
      {
        id: 1,
        ID_MAPA_PROCESO: 0,
        DESCRIPCION_PROCESO: 'Proceso1',
        TIPO: 'ellipse',
      },
      {
        id: 2,
        ID_MAPA_PROCESO: 0,
        DESCRIPCION_PROCESO: 'Proceso1',
        TIPO: 'cuadrado',
      },
      {
        id: 3,
        ID_MAPA_PROCESO: 0,
        DESCRIPCION_PROCESO: 'Proceso1',
        TIPO: 'circle',
      },
    ];

    var valor = this.filterProcesos.filter(
      (x: any) => x.ID_MAPA_PROCESO == event
    )[0];

    this.listNumbers1.forEach((element: any) => {
      element.ID_MAPA_PROCESO = valor.ID_MAPA_PROCESO;
      element.DESCRIPCION_PROCESO = valor.DESCRIPCION_PROCESO;
      element.ORDEN = valor.ORDEN;
      element.TIPO_PROCESO = valor.TIPO_PROCESO;
      //this.lista.push(element);
    });
    this.listNumbers2.forEach((element) => {
      if (element.ID_MAPA_PROCESO == event) {
        const title = 'Alerta';
        const message = 'Ya se encuentra registrado el proceso seleccionado';
        this.Message.showModal(title, message);
        this.listNumbers1 = [];
        return;
      }
    });
    this.listNumbers3.forEach((element) => {
      if (element.ID_MAPA_PROCESO == event) {
        const title = 'Alerta';
        const message = 'Ya se encuentra registrado el proceso seleccionado';
        this.Message.showModal(title, message);

        this.listNumbers1 = [];
        return;
      }
    });
    this.listNumbers4.forEach((element) => {
      if (element.ID_MAPA_PROCESO == event) {
        const title = 'Alerta';
        const message = 'Ya se encuentra registrado el proceso seleccionado';
        this.Message.showModal(title, message);
        this.listNumbers1 = [];
        return;
      }
    });
  }

  drop($event: any) {
    if ($event.previousContainer === $event.container) {
    } else {
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      );

      if (this.elementoEliminar.ID_DETALLE != 0) {
        this.api.deletetDiagramaMapaProceso(this.elementoEliminar).subscribe({
          next: (x) => {
            if (x.Confirmacion) {
              if (
                this.elementoEliminar.TIPO_PROCESO == 'Procesos Estratégicos'
              ) {
                this.listNumbers21 = this.listNumbers21.filter(
                  (x) => x.ID_DETALLE != this.elementoEliminar.ID_DETALLE
                );
                this.listNumbers2 = [...this.listNumbers21];
              }
              if (this.elementoEliminar.TIPO_PROCESO == 'Procesos Misionales') {
                this.listNumbers31 = this.listNumbers31.filter(
                  (x) => x.ID_DETALLE != this.elementoEliminar.ID_DETALLE
                );
                this.listNumbers3 = [...this.listNumbers31];
              }
              if (this.elementoEliminar.TIPO_PROCESO == 'Procesos Soporte') {
                this.listNumbers41 = this.listNumbers41.filter(
                  (x) => x.ID_DETALLE != this.elementoEliminar.ID_DETALLE
                );
                this.listNumbers4 = [...this.listNumbers41];
              }

              this.elementoEliminar = {};
            } else {
              this.elementoEliminar = {};
            }
          },
          error: (e) => {
            this.elementoEliminar = {};
          },
        });
      } else {
        if (this.elementoEliminar.TIPO_PROCESO == 'Procesos Estratégicos') {
          this.listNumbers21 = this.listNumbers21.filter(
            (x) => x.ID_MAPA_PROCESO != this.elementoEliminar.ID_MAPA_PROCESO
          );
          this.listNumbers2 = [...this.listNumbers21];
        }
        if (this.elementoEliminar.TIPO_PROCESO == 'Procesos Misionales') {
          this.listNumbers31 = this.listNumbers31.filter(
            (x) => x.ID_MAPA_PROCESO != this.elementoEliminar.ID_MAPA_PROCESO
          );
          this.listNumbers3 = [...this.listNumbers31];
        }
        if (this.elementoEliminar.TIPO_PROCESO == 'Procesos Soporte') {
          this.listNumbers41 = this.listNumbers41.filter(
            (x) => x.ID_MAPA_PROCESO != this.elementoEliminar.ID_MAPA_PROCESO
          );
          this.listNumbers4 = [...this.listNumbers41];
        }
      }
      this.listNumbers1 = [];
    }
  }

  getColorClassById(id: number): string {
    var nombre = '';
    if (id == 1) {
      nombre = 'ellipse';
    }
    if (id == 2) {
      nombre = 'cuadrado';
    }
    if (id == 3) {
      nombre = 'circle';
    }
    return nombre;
  }
  seleccionarProceso(elemto: any) {
    //this.Message.hideModal();
    elemto.ID_DETALLE = 0;
    if (elemto.TIPO_PROCESO == 'Procesos Estratégicos') {
      this.listNumbers2.push(elemto);
      this.listNumbers2.sort((a, b) => a.ORDEN - b.ORDEN);
      this.listNumbers21 = [...this.listNumbers2];
      this.listNumbers1 = [];
    }
    if (elemto.TIPO_PROCESO == 'Procesos Misionales') {
      this.listNumbers3.push(elemto);
      this.listNumbers3.sort((a, b) => a.ORDEN - b.ORDEN);
      this.listNumbers31 = [...this.listNumbers3];
      this.listNumbers1 = [];
    }
    if (elemto.TIPO_PROCESO == 'Procesos Soporte') {
      this.listNumbers4.push(elemto);
      this.listNumbers4.sort((a, b) => a.ORDEN - b.ORDEN);
      this.listNumbers41 = [...this.listNumbers4];
      this.listNumbers1 = [];
    }
  }
  seleccionado(event: any, element: any) {
    this.elementoEliminar = element;
  }
  iconoVisible = false;

  mostrarIcono() {
    this.iconoVisible = true;
  }

  ocultarIcono() {
    this.iconoVisible = false;
  }
}
