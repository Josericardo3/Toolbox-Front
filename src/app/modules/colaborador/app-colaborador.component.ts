import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { parse } from 'path';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { ApiService } from 'src/app/servicios/api/api.service';


@Component({
  selector: 'app-app-colaborador',
  templateUrl: './app-colaborador.html',
  styleUrls: ['./app-colaborador.css']
})

export class AppColaboradorComponent {
  modalRef: BsModalRef;
  correo!: any;
  responsable!: any;
  roles: any;
  arrayListResponsible: any =[];
  arrayStatus: any = [];
  registerNewColaboradorResponsable: boolean = false;
  @Output() valorEnviadoColaborador = new EventEmitter<boolean>();

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public ApiService: ApiService,
    private Message: ModalService,
  ) { }
  
  public registerNewColaborador!: FormGroup;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
  ngOnInit() {
    //validacion registar un nuevo colaborador
    this.registerNewColaborador = this.formBuilder.group(
      {
        responsable: ['', Validators.required],
        roles: ['', Validators.required],
        correo: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],
      })
      this.fnListResponsible();
      this.fnStatusList();
      this.fnConsultActivities();
  }
 
  openModal(template: any) {
    this.modalRef = this.modalService.show(template);
  }

  saveNewColaborador(){
    const closeModalButton = document.getElementById("closeModal");
    closeModalButton.click();
    const request = {
      idUsuario: parseInt(localStorage.getItem('Id')),
      nombre: this.registerNewColaborador.get("responsable")?.value,
      idcargo: parseInt(this.registerNewColaborador.get("roles")?.value),
      correo: this.registerNewColaborador.get("correo")?.value
    }
    console.log(request);

    this.ApiService.postRegisterColaborador(request).subscribe(
      (data) => {
          if(data.StatusCode == 201){
            this.registerNewColaborador.reset();
            const title = "Registro exitoso";
            const message = data.valor;
            this.Message.showModal(title, message);
            this.fnListResponsible();
            this.valorEnviadoColaborador.emit(true);
          }
          else if(data.StatusCode == 200){
            this.registerNewColaborador.reset();
            const title = "Registro no exitoso";
            const message = data.valor;
            this.Message.showModal(title, message);
            this.fnListResponsible();
            this.valorEnviadoColaborador.emit(true);
            const openModalButton = document.getElementById("openModalButton");
            openModalButton.click();
       
          }
          else{
            const openModalButton = document.getElementById("openModalButton");
            openModalButton.click();
          }
      },
      (error) => {
        this.registerNewColaborador.reset();
        const openModalButton = document.getElementById("closeModal");
        openModalButton.click();
        const title = "Error";
        const message = "Ha ocurrido un error al registrar el colaborador"
        this.Message.showModal(title, message);
      }
    )
    
  }

  fnListResponsible(){
    this.ApiService.getListResponsible().subscribe((data) => {
      this.arrayListResponsible = data;
    })
  }

  fnStatusList(){
    this.ApiService.getTypeList(1).subscribe((data) => {
      this.arrayStatus = data.filter((e:any) => e.ITEM!=0 && e.DESCRIPCION == 'SubPerfil');
    })
  }
  
  fnConsultActivities() {
    this.ApiService.getActivities().subscribe((data) => {})
  }

}
