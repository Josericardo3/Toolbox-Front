import { Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { ApiService } from 'src/app/servicios/api/api.service';
import { ColorLista } from 'src/app/servicios/api/models/color';
import { AppTarjetasComponent } from '../../Tarjetas/app-tarjetas/app-tarjetas.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  tituloEditar:any = "";
 descripcionEditar:any = "";
  @ViewChildren(AppTarjetasComponent) tarjetasComponent: QueryList<AppTarjetasComponent>;

  tarjetas: any[] = [];
  tarjetaActivaIndex: number | null = null;
  encuestaId: string;
  encuestaUrl: string;
  colorWallpaper: ColorLista;
  colorTitle: ColorLista;
  isCollapsed = true;
  mostrarNotificacion: boolean = false;


  /*ngOnInit(){
    this.api.colorTempo();
    this.colorWallpaper = JSON.parse(localStorage.getItem("color")).wallpaper;
    this.colorTitle = JSON.parse(localStorage.getItem("color")).title;
  }*/
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

  constructor(
    private Message: ModalService,
    private ApiService: ApiService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.tarjetasData = Array(this.tarjetas.length).fill({});

    this.formEncuesta = this.formBuilder.group( {
      tituloEncuesta: ['', Validators.required],
      descripcionEncuesta: ['', Validators.required]
    })

   this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.editandoEncuesta = true;
        console.log(this.editandoEncuesta)
        this.obtenerDatosEncuesta(params['id']);
        // this.valoresPreguntas = this.datosPreguntaEncuesta?.MAE_ENCUESTA_PREGUNTAS.map(pregunta => pregunta.VALOR) || [];
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

    if (this.tarjetasComponent.length > 0) {
      this.tarjetasComponent.last.completarFormulario();
    }
      console.log('agregado');
  }

  eliminarTarjeta(index?: number) {
    this.tarjetas.splice(index, 1);

    this.tarjetasData.splice(index, 1);
  }
  
  compartirEncuesta(){
    const encuestaId = '1';
    this.encuestaUrl = window.location.origin + `/encuestaCreada/${encuestaId}`;
    this.copyToClipboard(this.encuestaUrl);
  }

  copyToClipboard(text: string) {
    const inputElement = document.createElement('input');
    inputElement.value = text;
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement);

    const title = "URL PÚBLICA";
    const message = "Enlace de la encuesta copiado"
    this.Message.showModal(title, message);

    // alert('Enlace de la encuesta copiado');
  }
  
  onTarjetaCompletada(tarjetaData: any) {
    this.tarjetasData.push(tarjetaData);
    console.log(this.tarjetasData)
  }

  guardarRespuesta(respuesta: any, index: number) {
    this.tarjetasData[index] = respuesta;
  }

  saveEncuesta(){
    const titulo = this.formEncuesta.get('tituloEncuesta')?.value.toString();
    const descripcion = this.formEncuesta.get('descripcionEncuesta')?.value.toString();
    console.log(titulo, descripcion)
    
    const formDataForAllTarjetas = this.tarjetasComponent.map(component => {
      return component.completarFormulario();
    });
    console.log('array', formDataForAllTarjetas)

    const data = {
      "ID_MAE_ENCUESTA": 0,
      "TITULO": titulo,
      "DESCRIPCION": descripcion,
      "MAE_ENCUESTA_PREGUNTAS": formDataForAllTarjetas
    };
    console.log(data)

    this.ApiService.saveEncuesta(data)
    .subscribe( (d) => {
      console.log(d)
    });
  }

  actualizarEncuesta() {
    // Lógica para actualizar una encuesta existente
  }
  Obtenertitulo(evento:any){
    const titulo = this.formEncuesta.get('tituloEncuesta')?.value.toString();
    this.tituloEditar=titulo;
    console.log("eventooooo", titulo)
    const descripcion = this.formEncuesta.get('descripcionEncuesta')?.value.toString();
    this.descripcionEditar=descripcion;
  }
}