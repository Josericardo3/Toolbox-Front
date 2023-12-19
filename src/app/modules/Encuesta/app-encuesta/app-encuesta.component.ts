import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { ApiService } from 'src/app/servicios/api/api.service';
import { ColorLista } from 'src/app/servicios/api/models/color';
import { AppTarjetasComponent } from '../../Tarjetas/app-tarjetas/app-tarjetas.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunicacionService } from 'src/app/servicios/comunicacion/comunicacion.service';
import { Subscription } from 'rxjs';

interface Option {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-app-encuesta',
  templateUrl: './app-encuesta.component.html',
  styleUrls: ['./app-encuesta.component.css']
})

export class AppEncuestaComponent implements OnInit{

  @ViewChildren(AppTarjetasComponent) tarjetasComponent: QueryList<AppTarjetasComponent>;
  @Input() ultimoID: any;
  @Input() compartirEncuestaBtn: any;

  tituloEditar:any = "";
  descripcionEditar:any = "";
  activarTitulos: boolean = true;
  tarjetas: any[] = [];
  tarjetaActivaIndex: number | null = null;
  encuestaId: string;
  encuestaUrl: string;
  colorWallpaper: ColorLista;
  colorTitle: ColorLista;
  isCollapsed = true;
  mostrarNotificacion: boolean = false;
  idCounter: number = 2;
  public formEncuesta: FormGroup;
  formulariosTarjetas: any[] = [];
  public tarjetasData: any[] = [];
  editandoEncuesta: boolean = false;
  encuestaData: any;
  datosEncuesta: any = [];
  id: any;
  datosPreguntaEncuesta: any = []
  valoresPreguntas: any[] = []; 
  encuestaUrlEditar: string;
  idEncuestaEditar: any;
  mostrarBotonCompartir: boolean = false;
  tarjetaCompleta: boolean = false;
  selectCrearTarjeta: boolean = false;
  showModalConfirmacion: boolean = false;

  constructor(
    private Message: ModalService,
    private ApiService: ApiService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private comunicacionService: ComunicacionService
    ) { }

  ngOnInit() {
    this.tarjetasData = Array(this.tarjetas.length).fill({});

    this.formEncuesta = this.formBuilder.group({
      tituloEncuesta: ['', Validators.required],
      descripcionEncuesta: ['', Validators.required],
    });
        
   this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.idEncuestaEditar = params['id'];
        this.editandoEncuesta = true;
        console.log(this.editandoEncuesta)
        this.obtenerDatosEncuesta(params['id']);
      }
    });
  }

  obtenerDatosEncuesta(encuestaId: string) {
    this.ApiService.getEncuestasRespuesta(encuestaId)
    .subscribe(respuesta => {
      this.datosPreguntaEncuesta = respuesta;
      this.formEncuesta.get('tituloEncuesta').setValue(respuesta.TITULO);
      this.formEncuesta.get('descripcionEncuesta').setValue(respuesta.DESCRIPCION);
      this.valoresPreguntas = this.datosPreguntaEncuesta.MAE_ENCUESTA_PREGUNTAS;
      console.log(this.valoresPreguntas);
    });
  }
  
  agregarTarjeta(index?: number) {
    const nuevaTarjeta = { id: this.idCounter++ };
    this.tarjetas.splice(index + 1, 0, nuevaTarjeta);

    this.tarjetasData.splice(index + 1, 0, {}); 

    if (this.tarjetasComponent.length > 0 && index !== undefined) {
      this.tarjetasComponent.last.completarFormulario();
    }
    this.selectCrearTarjeta = false;
  }

  eliminarTarjeta(index?: number) {
    this.tarjetas.splice(index, 1);
    this.tarjetasData.splice(index, 1);
  }

  onUltimoIDChanged(id: any){
    this.ultimoID = id;
  }
  
  onActivarCompartir(btn: any){
    this.compartirEncuestaBtn = btn;
  }
  
  compartirEncuesta(){
    this.encuestaUrl = window.location.origin + `/encuestaCreada/${this.ultimoID}`;
    this.copyToClipboard(this.encuestaUrl);
    this.showModalConfirmacion = true;
    console.log(this.ultimoID)
  }

  copyToClipboard(text: string){
    const inputElement = document.createElement('input');
    inputElement.value = text;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);
  }

  closeModal(){
    this.showModalConfirmacion = false;
    this.router.navigate(['/tablaEncuestas'])
  }

  compartirEncuestaEditar(){
    this.encuestaUrlEditar = window.location.origin + `/encuestaCreada/${this.idEncuestaEditar}`;
    this.copyToClipboardEditar(this.encuestaUrlEditar);
  }

  copyToClipboardEditar(text: string) {
    const inputElement = document.createElement('input');
    inputElement.value = text;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);

    const title = "URL PÚBLICA";
    const message = "Enlace de la encuesta copiado"
    this.Message.showModal(title, message);
  }

  onTarjetaCompletada(tarjetaData: any) {
    this.tarjetasData.push(tarjetaData);
    console.log(this.tarjetasData)
  }
  
  guardarRespuesta(respuesta: any, index: number) {
    console.log(respuesta)
    this.tarjetasData[index] = respuesta;
    this.tarjetaCompleta = respuesta
    console.log(this.formEncuesta)
  }

  // saveEncuesta(){
  //   const titulo = this.formEncuesta.get('tituloEncuesta')?.value.toString();
  //   const descripcion = this.formEncuesta.get('descripcionEncuesta')?.value.toString();
  //   console.log(titulo, descripcion)
    
  //   const formDataForAllTarjetas = this.tarjetasComponent.map(component => {
  //     return component.completarFormulario();
  //   });
  //   console.log('array', formDataForAllTarjetas)

  //   const data = {
  //     "ID_MAE_ENCUESTA": 0,
  //     "TITULO": titulo,
  //     "FK_ID_USUARIO": localStorage.getItem('Id'),
  //     "DESCRIPCION": descripcion,
  //     "MAE_ENCUESTA_PREGUNTAS": formDataForAllTarjetas
  //   };
  //   console.log(data)

  //   this.ApiService.saveEncuesta(data)
  //   .subscribe( (d) => {
  //     const title = "ENCUESTA CREADA";
  //     const message = "Se creó la encuesta correctamente"
  //     this.Message.showModal(title, message);
  //     // this.ApiService.getEncuestas()
  //     // .subscribe(response => {
  //     //   console.log(response)
  //     //   const encuestas = response as Array<any>;

  //     //   if (encuestas.length > 0) {
  //     //     this.ultimoID = encuestas[encuestas.length - 1].ID_MAE_ENCUESTA;
  //     //     console.log('Último ID_MAE_ENCUESTA:', this.ultimoID);
  //     //   } else {
  //     //     console.log('No hay encuestas disponibles');
  //     //   }
  //     // })
  //   });
  // }

  Obtenertitulo(evento:any){
    const titulo = this.formEncuesta.get('tituloEncuesta')?.value.toString();
    this.tituloEditar = titulo;
    const descripcion = this.formEncuesta.get('descripcionEncuesta')?.value.toString();
    this.descripcionEditar = descripcion;

    this.activarTitulos = false;

    this.comunicacionService.notifyChild();
  }
}