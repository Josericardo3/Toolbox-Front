import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  imagen: any;
  nombre: string;
  foto : any;
  foto_borrada : any = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAMAAAC/MqoPAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAt9QTFRF/////v7+/f39/Pz84+Pjurq6l5eXdnZ2WFhYQUFBLS0tGhoaERERCwsLAAAAu7u7+/v7+Pj45ubmt7e3fHx8RkZGGBgYAwMDGRkZR0dHfX19uLi45+fn7+/vx8fHhISEPz8/DQ0NDg4OQEBAhoaGyMjI7e3txsbGLy8vBgYGMDAw9PT029vbnJycQ0NDPj4+lZWV19fX8vLyzs7OgYGBJycnHh4ecnJyycnJb29vGxsbcHBw7u7uy8vLHR0dd3d3ysrK8fHx1tbWkZGRLCwsKCgojY2N6OjosLCwRUVFAgICSEhIsbGx6enp+fn50dHReXl5FBQUFhYWenp6zc3NsrKySkpKAQEBr6+v3t7eioqKHBwci4uL3d3dzMzMaGhoBwcHBQUFZGRkv7+/vr6+tra2NDQ0MTExs7Oz+vr69vb2qKioKioqp6en9/f3mpqaHx8fICAgm5ublJSUk5OT9fX1nZ2dJSUlIyMjpaWlrq6uOjo6BAQEOTk5wMDATk5O6urqZ2dnDAwMcXFxtbW1MzMzvLy8CAgICQkJUlJS4ODgfn5+FRUVNTU1w8PDYmJimJiYoKCg2dnZS0tL3NzciYmJjIyM1NTURERE2traSUlJUFBQ4uLiISEh6+vrWVlZ7OzsdXV1CgoK09PToaGhJiYmo6Oj1dXVTExMrKysLi4uEBAQY2NjkpKSZWVlxcXFtLS0MjIypqamJCQkEhISg4ODExMTxMTEUVFRU1NTZmZme3t7FxcXz8/Ph4eHTU1N2NjYoqKipKSklpaWW1tbNjY2f39/hYWF39/fT09P4eHhvb29a2trOzs7PDw8wsLCqampnp6e8/Pzq6urKysr5eXlmZmZubm50NDQIiIigICAdHR0jo6O8PDwiIiIQkJCDw8P5OTkwcHBKSkpXFxc0tLSkJCQaWlpWlpaNzc3ODg4V1dXampqPT09goKCXl5ej4+PVFRUVlZWYGBgXV1ddNm8vwAAC21JREFUeJztnYtfVFUewOfeUVCB08yKDOiOPETkoYQoaojkC8XBUBEYAVEwhPDFQxTXQJDUIB9ZqDxURM31UbpgiiY+V1JJM9Os1WDNV6VpW+3+ATsTEYPMwMzcc87vHpjvX3C/n3vvOb/zO7/zOxIJVTiel3brbmXdo2cvG1s7hOxsbXr17GFt9VI3Kc9xdJ+FIrxM/pfe9n0cFEgPCkenvv3+Kpfx0E+JH16u7O/s4qrPugW3Ae4DlfJOZc/JPQbZe3q1792El3ff/h7yzvLp8z6Dh/jaGePdhN3LfkP9pdBPjQGpctjwAOO9mxgxcpSSdXmpx6BXbEwV1xI4un8Qy/K8/xjrYHPEtQS/OnYcsyOefPyEieaKawmZNF4O7WAW/OTQKSoh5prJPmzqawy++PBp02cIE9cSMTOStRfPeURFq4WbI6R2mRXE1CzPxcSaNa7rI252PEPu/Jy5CbjMEUqcN4eZH55/fQo+cS1OSYxM8bL5yXjNEUp5IxXayhgWLFyE2xyhgMVLoL06xj8tHb85QhmZ/tBmHbFkqSMJc4RsspZBu7VP+PJgLNN5W9SBaaIObqSLswXGroZRrfibiMd5bmqK3sQbHhSeK8Ub2yS9mUjOHKGc3FXQhoYYH40xhtNHQt5gaEf95K8uIGuOkNtbopziZLMdCA3uLaiD/cQYzq/xJDjENZOzdh20Z1ti8t4mb45QYdE70KYvkroeQ07GGDY4i+2TX+NJLJZpjWLjJmjX1uT3KKRjjlDBu0po21ZsJrJc04t6xXvQtrq8H5ZDTR0lFm+B9m2B2+pAz1yzft0GLdxCSSmFKb0FRXEMtPGfuEfQNEcoeCm0cTNl5ZQmtmYU23dAO/+B3wi65gjtTIN2bqKiB+WXjpBqVyW09e+EetI2R8j7DWhrLdLde+ir79kthjzd3jD65ghFj4f21vBBNoT6vr9De0sk4aOJpiIN4TUSfhdu/wEIc4TyhkKbSw4KqhQyn0OzoM15ZzcY9Q/dobM1lR/BmCM0LwhYfQ7I1KalfBiw+speUOrgP/vhDVDqEVmw5qnTKWamWpNoLwNVnww2yiF0JB9UvWQ7nHoRbBi/aQCcuu8/QNWrquHU164BVT/6MZx69mJQ9UxsVcCmEzcEVH2CLZz6MdiJPRYgOdWM3WxQdXejzu2RIcEdVP041R2n1iiOg6oPJ145ZBj1cFD1LvzWu/C/3oVH+MOA83oN7Lw+JBBOPW45qPpRkK2XJvbBxvBdeOV2oiecuu8gUPWSk3Dqn8BmaV6bB6d+qgJUXVYLss+qBTojK8miXDfWwmnoCrKVh6DUPUOB1SPB9tyizwCre4CNc0egd1rh9tfPgp/3Owi01eoJvdEqkew/B6Oedx7aXJL6Fki2QgwVVJILIIu3gH9Ce2soKYdQL4avHdOM8dYm9JLDhThqZCVTASqjU0RRGd2V6+ElF6mfgsjYDO38B4OjKb921QHRHHk6e5quukMstPGf7J9C95xbHzHMbH8QS/V0o2Ms+MqlhbJyinmqxAPx0L66pGVQM1dni+Dshw4edfTOrx8ZB23bmn7etLoWfHoC2vUFZJco9aqIuAx9+qENV+rpdCj55DNo07b09qbRlyb5KrSnHqSTaHQjuii6z11LxbUOmv4Lx22kKHtQaQKbc6Q7j9WLtPOYRPL650SDusTrX0AbGoSLqibaZTBKRLH7i/A39pHrLblvsSjycYZI/ZJcR9HlIsi8t8eSpYQOB9hkLYB26wj/IStImO/MvAlt1jHyW1/hNw9ZyEDPaG2n8E9xm1ez0SlcM86vKsc61qmLWekPr3EfZo2x4KBg5BlRBu764W5/jW3/defFbiKOZNrC+X9Tj+cGkNI145gy15C6ty+GGT5w/b/CoU1Mh8//ZpfAxI1X3vx8hn5zHVJjvhQ0zU3cXMbgK2+C8zljf8dc8fTayJus/eW6SJWRd/eZIx78bSe4zG5cSUOKqYP9it1jG1kX18Ivu7I4z4QQp6B0+eBOcXejFi5cOepSilGJu4Tqu6OCOs2Nnb/DyxvH/vved+17f+e7dWxj57qntQlOJp/c/VKYjd5ONjk25XdfmiyXdar33QqO46X3r6ZNr/P1jLN1RcjVNs7Tt256ZtLtTn0nswULFixYsGDBggULFixYsGDBggULFmBZkh9TMubBuqqq0Fu3Qquq1j0YU3Iln4kqIfORVexdt9DKfffquqIwl9zqlEMPHx5Kqc51CSt6tHq3u9WNdSWVnWXTRQdO+Thqae28vNwQh0K9G3DqQseQN+vn1fpFPW7sREnpm9MWOp8qTnE0YucpwTGl+NTlG48ZqA/sED7/6vdznRZ9aELVsMp2UdgPE5IqmN6A4hq/2PbjExsziuQTA5/ucu7HrH145KRdTx3NLpBXzaj+qWEYgxUlXMWtZ9dtBB4MUAQ+v3awkq1Rj9uxNC8ES/cOu4fFsfEMyZfcdQnGdhJE5fj85/3QRkZy3j4Z8z04G5Kt34e2MoIt9tXH8IprsV27XjTtKQzgMWEjAXEN6mPJs6EbzLWHLGrKaWInntQRPY+K9kDAmbp0okf8coIfTYN21IuP3yH9KxN8qAu/2irCQ62D6mdQ6FugqtneH9r0BRYcfkip455XwCQfaFtdtrxbQ60Xk+rYf8QzyXOzNibSvAkk8YlYzvUu20rqHKsh1CO2LYO21nJ/LvFmBW1xe3Yb2lvCRR4Aub0xp/4M8EcvTXKBuu/nyXzQ9K38BkBfyWYmHgVM3t/82uxDPTj4ONMH6KPnGv3SIc0RGpGlBHHnPH4BvO+mibjvPQDcucoGqq0F9ePYQD9ryQX5BUN7awnMCqLtrtwM/J83k5GmpGvu/x6RZhzmkH2B6hJ+GdzFH23xDqXYtkWe9DK0ry49k+S0zFMjf4W2bc3JSEoX//Dxq6m3Bm8fxdx4Onuyle4F0K4vYudM5aornwtx0KZtCbxAIWGXugrw4j7DJK8ivhPPx/8Ebamf34j/7o3HqbSLNZ3Cy4T7KctDRRG562NEFNFPni8bAG1omHuDSX7yPrUgOUjjyKklOMrLeoMnJ9rDpjuxoI677Qtt1z5Ok0mt3VO3AV45bgwJEwi9du68aNbohsgeSua1S69B7TYYjfoZmdf+oAbarGNqiNyWwOdBexnDSRJffHeAa9tMpyAJv7nMF9rKOJzwb0JGUbvYRRiF83Gbc/egnYylD+6/fZXoklKGcN2EWf03kWUiDaOqw2u+n4E5vZmavVjVv6V4aZlQvKxxmvvfEX0M24L6Ds5U1QfMDHJaCnBeWhwm4uRMW3Kc8JlPw3yWhTQb8A10PzMRvrdQ4I7LnM+lehepcBRPceVmR4mgXsg0HOZgUr8EUP8rDNfheMylLkyN71py7uFZuo6nftG2cNLLsKhvZih+b2bGchzm3CNGkhS6FP4Xx6q9sRdD8Xszam8cxXQnRFIWaRoZAzGoZzEWxTYRYYVB/aM90BrmYHdKuPmCz5lJTemiuC68gvJ8CLSFeTzcIli9islRTjPO9ROs/ksEtIR5nM4SrE7+omUyuL0i1JwrZigXq4tXnlB1nycMxnJa1LlCDwjEi+i4g2l4fiZQfVMAtIK5hAjt7HArA1rBXHauFKhuReiKZfIEpglUP8vk4kVLRKxA9VdtoRXMxXamQPW5TO226eJ6TaD6jyKt/O+Ywv8JVC8SeVmsYbx+Fah+jrkcfDOJ9QLVwxjbbmtBES1Q3ZfREB4hVWmXVVf7ClQ/yeiaVTPMFQlU/4Hdef2ZQPVMUR/0aY84odtuZYDthgSh9haakpXNZDSIP9ZX8Bb7O9eZDGpynu8Qai7h+wcwOL+pAwZiqCSSzklmLqJTpAzEUlHC3R/N2AznOvI2ruoxPqahNJ2RJZxXemlDjFHi/wcoCw0tIU4VkAAAAABJRU5ErkJggg=="

  dataInitial: any = [];
  totalPaginas: number = 0;
  datatotal: number = 0;
  contentArray: any = [];
  currentPage: number = 1;
  totalRegistros: number = 0;
  pages = 1;
  filter: string = '';
  showfilter: boolean = false;
  result: boolean = false;

  estiloEtiqueta: string='font-weight: bold; text-decoration: underline;';

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private Message: ModalService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.option='general';

    this.api.getLogo().subscribe(
      (data: any) => {
        this.imagen = data.LOGO;
      })

    this.api.getTypeList(1).subscribe((data) => {
      this.arrayStatus = data.filter((e:any) => e.ITEM!=0 && e.DESCRIPCION == 'SubPerfil');
    })


    this.principal = this.formBuilder.group({
      nombre_representante: ['',Validators.required],
      correo_representante: ['', [Validators.required, Validators.email]],
      numero_representante: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(9)]],
      pagina_web: ['', [Validators.required,Validators.pattern('^(https?:\\/\\/)?([\\w.-]+)\\.([a-z]{2,})(\\/\\S*)?$')]],
      instagram: ['', [Validators.required,Validators.pattern('^(https?:\\/\\/)?(www\\.)?instagram\\.com\\/([\\w\\d._]+)\\/?$')]],
      facebook: ['', [Validators.required,Validators.pattern('^(https?:\\/\\/)?(www\\.)?facebook\\.com\\/([\\w\\d._-]+)\\/?$')]],
      youtube: ['', [Validators.required,Validators.pattern('^(https?:\\/\\/)?(www\\.)?(youtube\\.com\\/|youtu\\.be\\/).*$')]],
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
      this.nombre = data.NOMBRE_REPRESENTANTE_LEGAL
    });

    this.segundo = this.formBuilder.group({
      nombre_empleado: ['', Validators.required],
      correo_empleado: ['', [Validators.required, Validators.email]],
      ocupacion: ['', Validators.required],
      enviar_correo: [true]

    });
    this.cargarDatosUsuarios();
  }

  elimiarFoto(){
    this.api.putLogo(this.foto_borrada).subscribe((data) => {
      const title = "Carga exitosa.";
      const message = "El registro se ha cargado exitosamente";
      this.Message.showModal(title, message);
      this.cargarDatosUsuarios();
    });
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
    
    this.nombre = request.NOMBRE_REPRESENTANTE_LEGAL;

    this.api.putUsserSettings(request).subscribe((data : any) => {
      if(data.StatusCode == 200){
        this.Message.showModal("Actualización Exitosa",data.Mensaje);
        this.api.putLogo(this.imagen).subscribe((data) => {
          this.cargarDatosUsuarios();
        });
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
        this.dataInitial = data;
        this.datosUsuarios.forEach(val=>{
          if(val.ID_CARGO==6)
            val.CARGO='Lider de proceso';
          else
            val.CARGO='Colaborador';
        })
            //paginado
        const totalPag = data.length;
        this.totalPaginas = Math.ceil(totalPag / 7);
        if (this.totalPaginas == 0) this.totalPaginas = 1;
        
        this.datatotal = this.dataInitial.length;
        this.datosUsuarios = this.dataInitial.slice(0, 7);
        this.contentArray = data;
        this.currentPage = 1
        if (this.datatotal >= 7) {
          this.totalRegistros = 7;
        } else {
          this.totalRegistros = this.dataInitial.length;
        }
        console.log(data);
      },
      error => {
        console.error('Error al obtener los datos', error);
      }
    );

    this.api.getLogo().subscribe(
      (data: any) => {
        this.imagen = data.LOGO;
        console.log(this.imagen);
      })
  }
  //
  pageChanged(event: any): void {
    this.pages = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage
    const endItem = event.page * event.itemsPerPage;

    if (this.filter.trim() !== '') {
      this.datatotal = this.contentArray.length;
      this.datosUsuarios = this.contentArray.slice(startItem, endItem)
    } else {
      this.datatotal = this.dataInitial.length;
      this.datosUsuarios = this.dataInitial.slice(startItem, endItem)
    }
    this.totalRegistros = this.datosUsuarios.length;
    this.cd.detectChanges();
  }
  filterResult() {
    this.result = false;
    if (!this.filter) {
      this.datosUsuarios = this.dataInitial;
      //para el paginado
      this.pages = 1;
      const totalPag = this.datosUsuarios.length;
      this.totalPaginas = Math.ceil(totalPag / 7);
      if (this.totalPaginas == 0) this.totalPaginas = 1;
      this.contentArray = this.datosUsuarios;
      this.totalRegistros = this.datosUsuarios.length;
      this.datatotal = this.datosUsuarios.length;
      if (this.totalRegistros == this.datatotal && this.totalRegistros >= 7) this.totalRegistros = 7;
      this.datosUsuarios = this.datosUsuarios.slice(0, 7);
      return this.datosUsuarios.length > 0 ? this.datosUsuarios : this.result = true;
    }
    else {
      let arrayTemp = this.dataInitial.filter((item) =>
        (item.CORREO.toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
        || (item.CARGO.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
        || (item.NOMBRE.trim().toUpperCase().includes(this.filter.trim().toUpperCase()) || this.filter.trim().toUpperCase() == '')
      )
      //this.fecfin = this.form.get('fechafin').value;
      //this.fecini = this.form.get('fechainicio').value;

      //let arrayTemp = this.dataInitial.filter((item) =>
      //  (item.FECHA_INICIO >= this.fecini && item.FECHA_FIN <= this.fecfin)
      //)
      //console.log(arrayTemp);
      this.contentArray = [];
      this.datosUsuarios = arrayTemp;
      //para el paginado
      this.pages = 1;
      const totalPag = this.datosUsuarios.length;
      this.totalPaginas = Math.ceil(totalPag / 7);
      if (this.totalPaginas == 0) this.totalPaginas = 1;
      this.contentArray = this.datosUsuarios;
      this.totalRegistros = this.datosUsuarios.length;
      this.datatotal = this.datosUsuarios.length;
      if (this.totalRegistros == this.datatotal && this.totalRegistros >= 7) this.totalRegistros = 7;
      this.datosUsuarios = this.datosUsuarios.slice(0, 7);
      return this.datosUsuarios.length > 0 ? this.datosUsuarios : this.result = true;
    }
  }

  //
  eliminarEmpleado(usuario: any){
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

  fnSubirFoto(e?: any) {

    if (e.target.files.length > 0) {
      const reader = new FileReader();
      const file = e.target.files[0];

      idUsuario : localStorage.getItem("Id");

      // Leer el archivo y convertirlo a base64
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const image = new Image();

        image.onload = () => {
          const width = image.width;
          const height = image.height;

          const MAX_WIDTH = 250;
          const MAX_HEIGHT = 250;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const title = "Error de carga";
            const message = `Las dimensiones del logo no deben exceder ${MAX_WIDTH}x${MAX_HEIGHT} píxeles.`;
            this.Message.showModal(title, message);
            return;
          }

          this.imagen = base64Data;

        };

        image.src = base64Data;
      };

      reader.readAsDataURL(file); 
    }
  }

  navigateToEdit() {
    localStorage.setItem('opcionEditar', '1');
    this.router.navigate(['/register']);
  }

  navigateCaracterizacion() {
    localStorage.setItem('opcionCaracterizacion', '1');
    this.router.navigate(['/caracterizacion']);
  }


}