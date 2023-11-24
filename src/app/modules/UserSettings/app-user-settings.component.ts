import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service'
import { Router } from '@angular/router';
import { locale } from 'moment';

@Component({
  selector: 'app-user-settings',
  templateUrl: './app-user-settings.component.html',
  styleUrls: ['./app-user-settings.component.css']
})
export class AppUserSettingsComponent implements OnInit {
  
  option: string;
  principal: FormGroup;
  segundo: FormGroup;
  arrayStatus: any = [];
  datosUsuarios: any[] = [];
  modoEdicion: boolean = true;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private Message: ModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.option='general';
    this.api.getTypeList(1).subscribe((data) => {
      this.arrayStatus = data.filter((e:any) => e.ITEM!=0 && e.DESCRIPCION == 'SubPerfil');
    })


    this.principal = this.formBuilder.group({
      nombre_representante: [''],
      correo_representante: [''],
      numero_representante: [''],
      pagina_web: [''],
      instagram: [null],
      facebook: [null],
      twitter: [null],
      otros: [null]
    });

    this.api.getUsuarioSettings().subscribe((data: any) => {
      this.principal.setValue({
        nombre_representante: data.NOMBRE_REPRESENTANTE_LEGAL,
        correo_representante: data.CORREO_REPRESENTANTE_LEGAL,
        numero_representante: data.TELEFONO_REPRESENTANTE_LEGAL,
        pagina_web: data.PAGINA_WEB,
        instagram: data.INSTAGRAM,
        facebook: data.FACEBOOK,
        twitter: data.TWITTER,
        otros: data.OTROS
      });
    });

    this.segundo = this.formBuilder.group({
      nombre_empleado: ['', Validators.required],
      correo_empleado: ['', [Validators.required, Validators.email]],
      ocupacion: ['', Validators.required],
      enviar_correo: [true]

    });

    this.cargarDatosUsuarios();


  }

  cambiarPassword() {
    this.router.navigate(['/recovery']);
  }

  updateGeneral(){
    
    var request = {
      NOMBRE_REPRESENTANTE_LEGAL : this.principal.value.nombre_representante,
      CORREO_REPRESENTANTE_LEGAL : this.principal.value.correo_representante,
      TELEFONO_REPRESENTANTE_LEGAL : this.principal.value.numero_representante,
      PAGINA_WEB : this.principal.value.pagina_web,
      INSTAGRAM : this.principal.value.instagram,
      FACEBOOK : this.principal.value.facebook,
      TWITTER : this.principal.value.twitter,
      OTROS : this.principal.value.otros
    };

    this.api.putUsserSettings(request).subscribe((data : any) => {
      if(data.StatusCode == 200){
        this.Message.showModal("Actualización Exitosa",data.Mensaje);
      }
    });

  }

  registrarEmpleado(){
    var request;
    if(this.modoEdicion == false){
      request = {
        CORREO : this.segundo.value.correo_empleado,
        NOMBRE : this.segundo.value.nombre_empleado,
        ID_CARGO : parseInt(this.segundo.get("ocupacion")?.value),
        ID_PST_ROLES : localStorage.getItem("ID_PST_ROLES")
      }
      this.api.updateUsuarioPstRoles(request).subscribe((data : any ) => {
        this.Message.showModal("Actualización Exitosa","");
        this.cargarDatosUsuarios();
      });

    }else{

      request = {
        idUsuario : localStorage.getItem("Id"),
        nombre : this.segundo.value.nombre_empleado,
        idcargo : parseInt(this.segundo.get("ocupacion")?.value),
        correo : this.segundo.value.correo_empleado,
        ENVIO_CORREO : this.segundo.value.enviar_correo
      }
  
      this.api.postRegisterColaborador(request).subscribe((data : any ) => {
        if(data.StatusCode == 201){
          this.Message.showModal("Registro Exitoso",data.valor);
          this.cargarDatosUsuarios();
        }else{
          this.Message.showModal("Error","Ocurrió un error en el registro");
        }
      })

    }
  }

  cargarDatosUsuarios() {
    this.modoEdicion = true;
    this.segundo.reset();
    this.api.obtenerUsuariosPstRoles().subscribe(
      (data: any[]) => {
        this.datosUsuarios = data;
      },
      error => {
        console.error('Error al obtener los datos', error);
      }
    );
  }

  eliminarEmpleado(usuario: any){
    console.log(usuario.ID_PST_ROLES);
    console.log(usuario);
    this.api.deleteUsuarioPstRoles(usuario.ID_PST_ROLES).subscribe((data : any ) => {
      if(data == true){
        this.Message.showModal("Proceso exitoso","Se eliminó correctamente el empleado");
        this.cargarDatosUsuarios();

      }else{
        this.Message.showModal("Proceso no exitoso","No se logró eliminar el empleado");
        this.cargarDatosUsuarios();

      }
    });
  }

  editarEmpleado(usuario: any){
    this.modoEdicion = false;
    this.segundo.setValue({
      nombre_empleado: usuario.NOMBRE,
      correo_empleado: usuario.CORREO,
      ocupacion: usuario.ID_CARGO,
      enviar_correo: null
    });

    localStorage.setItem("ID_PST_ROLES", usuario.ID_PST_ROLES);

  }

}