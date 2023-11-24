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
  @ViewChild('divEditable', { static: true }) divEditable!: ElementRef;
  tipoFilterCtrl: FormControl = new FormControl();
  selectedElement: string = 'boton'; // Elemento predeterminado
  listNumbers1: any = [];
  listNumbers2: any = [];
  listNumbers3: any = [];
  listNumbers4: any = [];
  filterProcesos: any = [];
  filterProcesosGroup:any=[];
  dataProcesos: any = [];
  lista: any = [];
  procesosMisionales=[];
  procesosEstrategicos=[];
  procesosApoyo=[];
  procesosMisionalesfilter:any=[];
  procesosEstrategicosfilter:any=[];
  procesosApoyofilter:any=[];
  todosProcesos:any=[];

  @ViewChild('contentToConvert') contentToConvert!: ElementRef;
  constructor(
    private api: ApiService,
    private breakpointObserver: BreakpointObserver,
    private Message: ModalService,
  ) {}

  ngOnInit() {
    this.verificarTamañoPantalla();
    this.listNumbers4 = [];
    this.getDataProceso();
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
        this.procesosMisionales = response.filter(item => item.TIPO_PROCESO === "Procesos Misionales");
        // Estrategicos
        this.procesosEstrategicos = response.filter(item => item.TIPO_PROCESO === "Procesos Estratégicos");
        // Apoyo soporte 
        this.procesosApoyo = response.filter(item => item.TIPO_PROCESO === "Procesos Soporte");
        
        this.todosProcesos=[
          {nombre:"Procesos Estratégicos",procesos:this.procesosEstrategicos},
          {nombre:"Procesos Misionales",procesos:this.procesosMisionales},
          {nombre:"Procesos Soporte",procesos:this.procesosApoyo}
        ];
        this.filterProcesosGroup=[
          {nombre:"Procesos Estratégicos",procesos:this.procesosEstrategicos},
          {nombre:"Procesos Misionales",procesos:this.procesosMisionales},
          {nombre:"Procesos Soporte",procesos:this.procesosApoyo}
        ];

      }
    });
  }
  generarPDF() {
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
        this.procesosMisionalesfilter=this.procesosMisionales.filter((bank: any) =>
        bank.DESCRIPCION_PROCESO.toLowerCase().indexOf(event) > -1);
        // Estrategicos
        this.procesosEstrategicosfilter= this.procesosEstrategicos.filter((bank: any) =>
        bank.DESCRIPCION_PROCESO.toLowerCase().indexOf(event) > -1);
        // Apoyo soporte 
        this.procesosApoyofilter=this.procesosApoyo.filter((bank: any) =>
        bank.DESCRIPCION_PROCESO.toLowerCase().indexOf(event) > -1);

        this.filterProcesosGroup = [ {nombre:"Procesos Estratégicos",procesos:this.procesosEstrategicosfilter},
        {nombre:"Procesos Misionales",procesos:this.procesosMisionalesfilter},
        {nombre:"Procesos Soporte",procesos:this.procesosApoyofilter}]
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
      element.ORDEN=valor.ORDEN;
      element.TIPO_PROCESO=valor.TIPO_PROCESO;
      //this.lista.push(element);
    });
    this.listNumbers2.forEach(element => {
      if(element.ID_MAPA_PROCESO == event){
        const title = "Alerta";
        const message = "Ya se encuentra registrado el proceso seleccionado";
        this.Message.showModal(title, message);
        this.listNumbers1 = []
        return;
      }

    });
    this.listNumbers3.forEach(element => {
      if(element.ID_MAPA_PROCESO == event){
        const title = "Alerta";
        const message = "Ya se encuentra registrado el proceso seleccionado";
        this.Message.showModal(title, message);
        
        this.listNumbers1 = []
        return;
      }
    });
    this.listNumbers4.forEach(element => {
      if(element.ID_MAPA_PROCESO == event){
        const title = "Alerta";
        const message = "Ya se encuentra registrado el proceso seleccionado";
        this.Message.showModal(title, message);
        this.listNumbers1 = []
        return;
      }
    });
    
  }

  drop($event: any) {
    
    if ($event.previousContainer === $event.container) {
      moveItemInArray(
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      );
    } else {
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
  
      );
      this.listNumbers1 = []
    
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
  seleccionarProceso(elemto){
    
      this.Message.hideModal();
    if(elemto.TIPO_PROCESO=="Procesos Estratégicos"){
        this.listNumbers2.push(elemto)
        this.listNumbers2.sort((a, b) => a.ORDEN - b.ORDEN);
        this.listNumbers1=[];
    }
    if(elemto.TIPO_PROCESO=="Procesos Misionales"){
      this.listNumbers3.push(elemto)
      this.listNumbers3.sort((a, b) => a.ORDEN - b.ORDEN);
      this.listNumbers1=[];
    }
    if(elemto.TIPO_PROCESO=="Procesos Soporte"){
      this.listNumbers4.push(elemto);
      this.listNumbers4.sort((a, b) => a.ORDEN - b.ORDEN);
      this.listNumbers1=[];
    }
    
  }
}
