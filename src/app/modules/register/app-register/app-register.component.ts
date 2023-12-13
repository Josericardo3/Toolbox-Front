import { Component, OnInit, ComponentFactoryResolver, Renderer2 } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, Validators, FormBuilder, FormControl, Validator } from '@angular/forms';
import { CustomValidators } from '../../../models/customeValidator'
import { ApiService } from '../../../servicios/api/api.service'
import { Store } from '@ngrx/store'
import 'jquery-ui/ui/widgets/dialog.js'
import { Categoria } from '../../../utils/constants'
import { ModalService } from '../../../messagemodal/messagemodal.component.service';
import { debug } from 'console'
import { elementAt, timeInterval } from 'rxjs'
import { TimeInterval } from 'rxjs/internal/operators/timeInterval'
import { Location } from '@angular/common';
import { stringify } from 'querystring'


@Component({
  selector: 'app-app-register',
  templateUrl: './app-register.component.html',
  styleUrls: ['./app-register.component.css'],
})
export class AppRegisterComponent implements OnInit {
  password: string = '';
  opcionEditar: string = '';
  repeatPassword: string = '';
  showPassword: boolean = false;
  showRepeatPassword: boolean = false;
  showModalSuccess: any;
  data: any;
  datosRnt: any = [];
  selectedCategory: any; 
  mostrarErrorCorreo: any;
  arrAgency: any;
  accionDisabled: boolean = true;
  public registerForm!: FormGroup;
  isChecked: boolean = false;
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  imagenPrevisualizada: string | ArrayBuffer = '';
imagenLogo:any={
  esAvatar:false,
  logo:'',
  idAvatar:0
};
avatares = [
  "../../../../assets/avatares/avatar1.svg",
  "../../../../assets/avatares/avatar2.svg",
  "../../../../assets/avatares/avatar3.svg",
  "../../../../assets/avatares/avatar4.svg",
  "../../../../assets/avatares/avatar5.svg",
  "../../../../assets/avatares/avatar6.svg"
];
avatarSeleccionado: number=-1;
//deshabilitarAvatars:any=false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ComponentFactoryResolver: ComponentFactoryResolver,
    public ApiService: ApiService,
    private categoria: Categoria,
    private Message: ModalService,
    private renderer: Renderer2,
    private store: Store<{ dataLogin: any }>,
    private location: Location    
  ) { }

  ngOnInit(): void {

    localStorage.removeItem("newUser")
    var opcion = localStorage.getItem("opcionEditar");

    this.data = this.categoria.name.tipo
    this.setDepartments('')
    this.registerForm = this.formBuilder.group(
      {
        telefono: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^\d{10}$/)]),
        ],
        /*telefonoDelRepresentanteLegal: ['',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^\d{10}$/)]),
        ],*/
        /*telefonoDelResponsableDeSostenibilidad: ['',
          Validators.compose([
            Validators.required,
            Validators.pattern(/^\d{10}$/)]),
        ],*/
        numeroDeIdentificacionTributaria: ['', Validators.required],
        registroNacionalDeTurismo: ['', Validators.required],
        categoriaRnt: ['', Validators.required],
        subcategoriaRnt: ['', Validators.required],
       // nombreDelPst: ['', Validators.required],
        razonSocialDelPst: ['',Validators.compose([Validators.required,Validators.pattern(/^\S.*\S$/)]) ],
        correo: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],

        nombreDelRepresenteLegal: ['',Validators.compose([Validators.required,Validators.maxLength(45),Validators.pattern(/^\S.*\S$/)])] ,
        apellidoDelRepresenteLegal:  ['',Validators.compose([Validators.required,Validators.maxLength(50),Validators.pattern(/^\S.*\S$/)])],
        
        /*correoRepresentanteLegal: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],*/
        correo2: [
          '',
          Validators.compose([
            
            Validators.required,
          ]),
        ],

        //tipoDeIdentificacionDelRepresentanteLegal: ['', Validators.required],
        //identificacionDelRepresentanteLegal: ['', Validators.required],
        departamento: ['', Validators.required],
        municipio: ['', Validators.required],
        /*correoDelResponsableDeSostenibilidad: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],*/

       // nombreDelResponsableDeSostenibilidad: ['', Validators.required],
        password1: [
          '',
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
            CustomValidators.patternValidator(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9 ]).{8,12}$/,{
              hasSpecialCharacters: true,
            }),
            CustomValidators.patternValidator(/^[^\s]*$/, {
              noSpaces: true,
            }),
            Validators.minLength(8),
            Validators.maxLength(12),
          ]),
        ],
        confirmPassword: ['', Validators.compose([Validators.required])],
        checkbox: ['', Validators.required]

      },
      {
        // check whether our password and confirm password match
        validator:[ CustomValidators.comparePassword, CustomValidators.validarIgualdadInputs]
      },
    )

    
    if(opcion == "1"){

      this.ApiService.getUserRegistro().subscribe((data) => {
        if (data && data.length > 0) {
          const firstUser = data[0]; 
          console.log(firstUser);
          this.registerForm.setValue({
            registroNacionalDeTurismo: firstUser.RNT,
            numeroDeIdentificacionTributaria: firstUser.NIT,
            categoriaRnt: firstUser.FK_ID_CATEGORIA_RNT,
            subcategoriaRnt: firstUser.FK_ID_SUB_CATEGORIA_RNT,
            //nombreDelPst: firstUser.NOMBRE_PST,
            razonSocialDelPst: firstUser.RAZON_SOCIAL_PST,
            correo: firstUser.CORREO_PST,
            telefono: firstUser.TELEFONO_PST,
            //tipoDeIdentificacionDelRepresentanteLegal : "CEDULA DE CIUDADANIA",
            nombreDelRepresenteLegal: firstUser.NOMBRE_REPRESENTANTE_LEGAL,
            apellidoDelRepresenteLegal:"",
            //correoRepresentanteLegal: firstUser.CORREO_REPRESENTANTE_LEGAL,
            //telefonoDelRepresentanteLegal: firstUser.TELEFONO_REPRESENTANTE_LEGAL,
            //identificacionDelRepresentanteLegal: firstUser.IDENTIFICACION_REPRESENTANTE_LEGAL,
            departamento: firstUser.DEPARTAMENTO,
            municipio: firstUser.MUNICIPIO,
            //nombreDelResponsableDeSostenibilidad: firstUser.NOMBRE_RESPONSABLE_SOSTENIBILIDAD,
            //correoDelResponsableDeSostenibilidad: firstUser.CORREO_RESPONSABLE_SOSTENIBILIDAD,
            correo2: firstUser.CORREO_RESPONSABLE_SOSTENIBILIDAD,
            //telefonoDelResponsableDeSostenibilidad: firstUser.TELEFONO_RESPONSABLE_SOSTENIBILIDAD,
            password1 : "",
            confirmPassword : "",
            checkbox: ''
          });

          const selectedIndex = this.data.findIndex(element => element.name === firstUser.CATEGORIA_RNT);
          const selectedcategory = this.data.find(element => this.normalizeString(element.name) === this.normalizeString(firstUser.CATEGORIA_RNT));
          const categoryelectedid =selectedcategory.id;

        // Si se encontró el índice, establece el valor seleccionado en el campo de selección
          if (selectedIndex !== -1) {
            this.registerForm.get('categoriaRnt').setValue(this.data[selectedIndex]);
          }
          const filterCategory = this.categoria.name.agencias.filter(
            (agency: { id_categoria: number; name: string }) =>
              agency.id_categoria === categoryelectedid
          )
          this.arrAgency = filterCategory.sort();
          const selectedIndexSub = this.arrAgency.findIndex(element => element.id === firstUser.FK_ID_SUB_CATEGORIA_RNT);
          this.registerForm.get('subcategoriaRnt').setValue(this.arrAgency[selectedIndexSub]);
          this.setDepartments(firstUser.DEPARTAMENTO);
          this.setMunicipalities(firstUser.MUNICIPIO);

          }

      });

    }
   

  }
  specialCharacterValidator():any{
    return (control) => {
      const value = control.value;
      if (!value) {
        return null;  // El valor es nulo, la validación debería ser manejada por otro validador
      }

      const hasSpecialCharacter =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&""//((==¿¿¡¡??\\\\)])[A-Za-z\d@$!%*?&""//((==¿¿¡¡??\\\\)]{8,}$/.test(value);
      return hasSpecialCharacter ? null : { hasSpecialCharacters: true };
    };

  }
  deshabilitarCampos(deshabilitar: boolean) {
    /*if (deshabilitar) {
      // Deshabilita todos los controles del formulario
      this.registerForm.disable();
      this.registerForm.get('registroNacionalDeTurismo').enable();
      this.accionDisabled = true;
    } else {
      // Habilita todos los controles del formulario
      this.registerForm.enable();
      this.accionDisabled = false;
    }*/
  }
  normalizeString(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  
  
  onLoadCategory(evt: any) {
    const filterCategory = this.categoria.name.agencias.filter(
      (agency: { id_categoria: number; name: string }) =>
        agency.id_categoria === evt.target.options.selectedIndex
    )

    this.arrAgency = filterCategory.sort();
    return this.arrAgency;
  }

  async setDepartments(evt: any) {
    let valor = evt?.target?.value || evt;
    let departments: any[] = [];
    let departmentsCode: any[] = [];
    let select = document.getElementById(
      'selectDepartment',
    ) as HTMLSelectElement
    if (select.options.length === 0) {
      fetch('https://www.datos.gov.co/resource/gdxc-w37w.json?$limit=1121')
        .then((response) => response.json())
        .then((data) => {
          // esta linea llena el array
          if (select != null && departments.length === 0) {
            departments = Array.from(
              new Set(data.map((item: any) => {
                return item.dpto
              })),
            )
            departmentsCode = Array.from(
              new Set(data.map((item: any) => {
                return item.cod_depto
              })),
            )
            select.add(new Option('Seleccione un departamento', '0', true))
            departments.forEach((item: any, index) => {
              let option = document.createElement('option')
              option.id = departmentsCode[index]
              option.text = item
              select.add(option)

            })

          }
        })
    }
    this.setMunicipalities(valor)
  }

  setMunicipalities(selectedDepartament: any) {
    let arrFilterMpio: any[] = []
    let select = document.getElementById(
      'selectMunicipality',
    ) as HTMLSelectElement
    select.length = 0
    if (select.options.length > 0) {
      arrFilterMpio.forEach((item: any, index: any) => {
        select.remove(index)
      })
    }
    fetch('https://www.datos.gov.co/resource/gdxc-w37w.json?$limit=1121')
      .then((response) => response.json())
      .then((data) => {
        arrFilterMpio = data.filter(
          (item: any) => item.dpto === selectedDepartament,
        )
        let select = document.getElementById(
          'selectMunicipality',
        ) as HTMLSelectElement
        if (select != null) {
          select.add(new Option('Seleccione un municipio', '0'))
          arrFilterMpio.forEach((item: any, index: any) => {
            let option = document.createElement('option')
            option.text = item.nom_mpio
            select.add(option)
          });
          const selectedOption = arrFilterMpio.find(
            (item) => item.cod_mpio === this.datosRnt?.codigo_municipio
          );
          if (selectedOption) {
            this.registerForm.get('municipio').setValue(selectedOption.nom_mpio);
          }
        }
      })
  }

  seePasswordRegister() {
   /* const passRegister = document.querySelector(
      '#passRegister',
    ) as HTMLInputElement
    const icon = document.querySelector('i') as HTMLElement
    if (passRegister.type === 'password') {
      passRegister.type = 'text'
      icon.classList.remove('fa-eye-slash')
      icon.classList.add('fa-eye')
    } else {
      passRegister.type = 'password'
      icon.classList.add('fa-eye-slash')
      icon.classList.remove('fa-eye')
    }*/
    const passLogin = document.querySelector("#passRegister") as HTMLInputElement;
    const icon = document.querySelector("#icon") as HTMLElement;
    if (passLogin.type === "password") {
      passLogin.type = "text";
      this.renderer.setStyle(icon, 'color', '#068460');
    } else {
      passLogin.type = "password";
      this.renderer.setStyle(icon, 'color', 'black');
    }
  }

  seePasswordRegister2() {
    /*const passRegister2 = document.querySelector(
      '#passRegister2',
    ) as HTMLInputElement
    const icon = document.querySelector('#i') as HTMLElement
    if (passRegister2.type === 'password') {
      passRegister2.type = 'text'
      icon.classList.remove('fa-eye-slash')
      icon.classList.add('fa-eye')
    } else {
      passRegister2.type = 'password'
      icon.classList.add('fa-eye-slash')
      icon.classList.remove('fa-eye')
    }*/
    const passLogin = document.querySelector("#passRegister2") as HTMLInputElement;
    const icon = document.querySelector("#icon2") as HTMLElement;
    if (passLogin.type === "password") {
      passLogin.type = "text";
      this.renderer.setStyle(icon, 'color', '#068460');
    } else {
      passLogin.type = "password";
      this.renderer.setStyle(icon, 'color', 'black');
    }
  }

  openModal() {

    const modal = document.querySelector('#modalTerminos') as HTMLInputElement
    modal.classList.add('active')
    if( this.checkboxSave === false ) {
      this.registerForm.controls['checkbox'].setValue(false);
    }
  }
  checkboxSave: boolean = false; 
  closeModal(evt: any) {
    evt.defaultPrevented
    const modal = document.querySelector('#modalTerminos') as HTMLInputElement
    modal.classList.remove('active');
    this.registerForm.controls['checkbox'].setValue(true);
    this.checkboxSave= true; 

    //this.VendedorForm.controls['identidad'].setValue(response.body.data.identidad);

  }

  close() {
    this.registerForm.controls['checkbox'].setValue(false);
    const modal = document.querySelector('#modalTerminos') as HTMLInputElement
    modal.classList.remove('active');
    this.registerForm.get('checkbox').setErrors({ valido: true });
    //this.VendedorForm.controls['identidad'].setValue(response.body.data.identidad);

  }
  async validarRnt(): Promise<any> {
    
    const rnt = this.registerForm.get('registroNacionalDeTurismo').value;
    const nit = this.registerForm.get('numeroDeIdentificacionTributaria').value;
    
    if(rnt==""){
      const title = "Mensaje";
      const message = "Debe completar el campo de Registro Nacional de Turismo";
      this.Message.showModal(title, message);
      this.deshabilitarCampos(true);
      return;
    }  
    if(nit==""){
      const title = "Mensaje";
      const message = "Debe completar el campo de Número de identificación tributaria";
      this.Message.showModal(title, message);
      this.deshabilitarCampos(true);
      return;
    }  
    await this.verificarRnt(rnt,nit);
    if (this.showFaXmarkRnt == true) {
      const title = "Mensaje";
      const message = "El Registro Nacional de Turismo ya se encuentra registrado";
      this.Message.showModal(title, message);
      this.msjRnt="Validación icorrecta"
      //this.deshabilitarCampos(true);
    } else {
      
      this.ApiService.ValidateRntMincit(rnt).subscribe({ next:(data:any)=> {
        
        if (data.error) {
          this.msjRnt="Validación icorrecta"
          const title = "Error";
          const message = data.error.message;
          this.Message.showModal(title, message);

          this.registerForm.get('correo').setValue('');//no
          //this.registerForm.get('numeroDeIdentificacionTributaria').setValue('');
          this.registerForm.get('razonSocialDelPst').setValue('');//nombre de la empresa
          this.registerForm.get('telefono').setValue('');//no
          this.registerForm.get('nombreDelRepresenteLegal').setValue('');
          this.registerForm.get('categoriaRnt').setValue('');
          this.registerForm.get('subcategoriaRnt').setValue('');

          this.registerForm.get('departamento').setValue('');
          this.registerForm.get('municipio').setValue('');
          this.deshabilitarCampos(true);
        }
        else {
          this.msjRnt=""
          this.datosRnt = data;
          
          this.deshabilitarCampos(false);
          
          if(this.datosRnt?.numero_identificacion!=nit){
            this.msjRnt="Validación icorrecta"
            const title = "Alerta";
          const message = "El Número de identificación tributaria, no pertenece al Registro Nacional de Turismo ingresado";
          this.Message.showModal(title, message);
          return;
          }

          //aqui debo mandar el subcategoria filtrado
          //this.registerForm.get('correo').setValue(this.datosRnt?.correo_electronico_prestador);
          //this.registerForm.get('numeroDeIdentificacionTributaria').setValue(this.datosRnt?.numero_identificacion);


         // this.registerForm.get('telefono').setValue(this.datosRnt?.numero_telefonico);
          this.registerForm.get('razonSocialDelPst').setValue(this.datosRnt?.razon_social);
          const selectedIndex = this.data.findIndex(element => element.name === this.datosRnt.categoria);

          const selectedcategory = this.data.find(element => this.normalizeString(element.name) === this.normalizeString(this.datosRnt?.categoria));
          const categoryelectedid =selectedcategory?.id;

          // Si se encontró el índice, establece el valor seleccionado en el campo de selección
          if (selectedIndex !== -1) {
            this.registerForm.get('categoriaRnt').setValue(this.data[selectedIndex]);
          }
          const filterCategory = this.categoria.name.agencias.filter(
            (agency: { id_categoria: number; name: string }) =>
              agency.id_categoria === categoryelectedid
          )
          this.arrAgency = filterCategory.sort();
          const selectedIndexSub = this.arrAgency.findIndex(element => this.normalizeString(element.name) === this.normalizeString(this.datosRnt?.subcategoria));
          
          if (selectedIndexSub !== -1) {
            this.registerForm.get('subcategoriaRnt').setValue(this.arrAgency[selectedIndexSub]);
          }

                      
      let selectDepartments = document.getElementById('selectDepartment') as HTMLSelectElement
      let nameDepartment;
        for (let i = 0; i < selectDepartments.options.length; i++) {
          if (selectDepartments.options[i].id === String(this.datosRnt?.codigo_departamento)) {
            nameDepartment = selectDepartments.options[i].value;
            break;
          }
        }
       this.registerForm.get('departamento').setValue(nameDepartment);
      this.setDepartments(nameDepartment);

      //this.verificarCorreo(this.datosRnt?.correo_electronico_prestador);
      /*this.verificarPhone(this.datosRnt?.numero_telefonico);*/
          return this.arrAgency;
        }
        
     },error: (e) => {
      
      const title = "Error";
          const message = "Algo salió mal, vuelva a validar";
          this.Message.showModal(title, message);
          this.msjRnt="Validación icorrecta"
          this.registerForm.get('correo').setValue('');
          //this.registerForm.get('numeroDeIdentificacionTributaria').setValue('');
          this.registerForm.get('razonSocialDelPst').setValue('');
          this.registerForm.get('telefono').setValue('');
          this.registerForm.get('nombreDelRepresenteLegal').setValue('');
          this.registerForm.get('categoriaRnt').setValue('');
          this.registerForm.get('subcategoriaRnt').setValue('');
          this.registerForm.get('departamento').setValue('');
          this.registerForm.get('municipio').setValue('');
          this.deshabilitarCampos(true);
     },
    
    })    
    }        
    


  }


  saveUser() {
    
    if( this.imagenLogo.logo==""){
      const title = "Error de carga";
            const message = `Ingrese un logo.`;
            this.Message.showModal(title, message);
            return;
    }
    if(this.imagenLogo.idAvatar==0 || this.imagenLogo.idAvatar==-1){
      const title = "Error de carga";
            const message = `Seleccione un Avatar.`;
            this.Message.showModal(title, message);
            return;
    }
    const request = {
      NIT: this.registerForm.get("numeroDeIdentificacionTributaria")?.value.toString(),
      RNT: this.registerForm.get("registroNacionalDeTurismo")?.value,
      FK_ID_CATEGORIA_RNT: this.registerForm.get("categoriaRnt")?.value.id,
      FK_ID_SUB_CATEGORIA_RNT: this.registerForm.get("subcategoriaRnt")?.value.id,
      //NOMBRE_PST: this.registerForm.get("nombreDelPst")?.value,
      NOMBRE_PST: this.registerForm.get("razonSocialDelPst")?.value,
      RAZON_SOCIAL_PST: this.registerForm.get("razonSocialDelPst")?.value,
      //RAZON_SOCIAL_PST: this.registerForm.get("razonSocialDelPst")?.value,
      CORREO_PST: this.registerForm.get("correo")?.value,
      //CORREO_PST: this.registerForm.get("correo")?.value,
      
      TELEFONO_PST: this.registerForm.get("telefono")?.value,
      NOMBRE_REPRESENTANTE_LEGAL: this.registerForm.get(
        "nombreDelRepresenteLegal",
      )?.value,
      APELLIDO_REPRESENTANTE_LEGAL: this.registerForm.get(
        "apellidoDelRepresenteLegal",
      )?.value,
      CORREO_REPRESENTANTE_LEGAL: this.registerForm.get(
        "correo",
      )?.value,
      /*CORREO_REPRESENTANTE_LEGAL: this.registerForm.get(
        "correoRepresentanteLegal",
      )?.value,*/
      TELEFONO_REPRESENTANTE_LEGAL: "-",
      //TELEFONO_REPRESENTANTE_LEGAL: this.registerForm.get("telefonoDelRepresentanteLegal")?.value,
      FK_ID_TIPO_IDENTIFICACION: 1,//modificado
      /*IDENTIFICACION_REPRESENTANTE_LEGAL: this.registerForm.get(
        "identificacionDelRepresentanteLegal",
      )?.value,*/
      IDENTIFICACION_REPRESENTANTE_LEGAL: "-",
      DEPARTAMENTO:this.registerForm.get("departamento")?.value,
      MUNICIPIO:this.registerForm.get("municipio")?.value,
      /*NOMBRE_RESPONSABLE_SOSTENIBILIDAD: this.registerForm.get(
        "nombreDelResponsableDeSostenibilidad",
      )?.value,*/
      NOMBRE_RESPONSABLE_SOSTENIBILIDAD: "-",
     /* CORREO_RESPONSABLE_SOSTENIBILIDAD: this.registerForm.get(
        "correoDelResponsableDeSostenibilidad",
      )?.value,*/
      CORREO_RESPONSABLE_SOSTENIBILIDAD: "-",
      //TELEFONO_RESPONSABLE_SOSTENIBILIDAD: this.registerForm.get("telefonoDelResponsableDeSostenibilidad")?.value,
      TELEFONO_RESPONSABLE_SOSTENIBILIDAD: "-",
      PASSWORD: this.registerForm.get("password1")?.value,
      //AVATAR
      FK_ID_TIPO_AVATAR: this.imagenLogo.idAvatar,
      
      ESAVATAR:this.imagenLogo.esAvatar,
      LOGO:this.imagenLogo.logo
    }
  
    localStorage.setItem("newUser", 'yes')
    
    this.ApiService.createUser(request).subscribe((data: any) => {
      if (data.StatusCode === 201) {
        const title = "Registro exitoso";
        const message = "El registro se ha realizado exitosamente, favor validar su cuenta, ingresando a su correo"
        this.Message.showModal(title, message);
        this.router.navigate(['/']);      
      }
      if (data.StatusCode === 404) {
        const title = "Alerta";
        const message = data.Valor+": "+data.Mensaje
        this.Message.showModal(title, message);
        //this.router.navigate(['/']);      
      }
      
    })
  }
  
  change(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isChecked = checkbox.checked;
    this.registerForm.controls['checkbox'].setValue(this.isChecked);
    // const btnAceptar = document.querySelector('#btnAceptar') as HTMLInputElement
    // if(btnAceptar.getAttribute('disabled')===null){
    //   return btnAceptar.setAttribute("disabled",'');
    // }else{
    //   return btnAceptar.removeAttribute("disabled");
    // }
  }

  //prueba limpiar(){
  // this.registerForm.reset();
  // }

  //Obj 

  msjRnt: string = '';
  showCheckRnt: boolean = false;
  showFaXmarkRnt: boolean = false;

  async verificarRnt(rnt: any, nit:any): Promise<void> {

    this.showFaXmarkRnt = false;
    this.showCheckRnt = false;
    this.msjRnt = '';
    if (rnt?.target != null){
      rnt = rnt.target.value
    }
    try {
      const data: any = await this.ApiService.validateRnt(rnt).toPromise();
      
      if (data === false) {
        
        this.showCheckRnt = true;
        this.showFaXmarkRnt = false;
        //this.msjRnt = 'Valide Nuevamente';

        this.registerForm.get('correo').setValue('');
        //  this.registerForm.get('numeroDeIdentificacionTributaria').setValue('');
          this.registerForm.get('razonSocialDelPst').setValue('');
          this.registerForm.get('telefono').setValue('');
          this.registerForm.get('nombreDelRepresenteLegal').setValue('');
          this.registerForm.get('categoriaRnt').setValue('');
          this.registerForm.get('subcategoriaRnt').setValue('');

          this.registerForm.get('departamento').setValue('');
          this.registerForm.get('municipio').setValue('');
          this.deshabilitarCampos(true);
      }
      if (data === true) {
        
        this.registerForm.get('registroNacionalDeTurismo').setErrors({ valido: true });
        this.msjRnt = 'El Registro Nacional de Turismo ya se encuentra registrado';
        this.showFaXmarkRnt = true;
        this.showCheckRnt = false;
        this.registerForm.get('correo').setValue('');
        //  this.registerForm.get('numeroDeIdentificacionTributaria').setValue('');
          this.registerForm.get('razonSocialDelPst').setValue('');
          this.registerForm.get('telefono').setValue('');
        //  this.registerForm.get('nombreDelRepresenteLegal').setValue('');
        /*  this.registerForm.get('categoriaRnt').setValue('');
          this.registerForm.get('subcategoriaRnt').setValue('');

          this.registerForm.get('departamento').setValue('');
          this.registerForm.get('municipio').setValue('');*/
          this.deshabilitarCampos(true);
      }
    } catch (error) {
      // Manejo de errores si la llamada API falla
      console.error('Error al validar el RNT:', error);
    }
  }




  msjEmail: string;
  showCheck: boolean = false;
  showFaXmark: boolean = false;
  bordeInpunt: boolean = false;
  verificarCorreo(correo: any): void {
    correo = correo.target ? correo.target.value : correo;
    this.ApiService.validateEmail(correo).subscribe((data: any) => {
      if (data == false) {
        this.showCheck = true;
        this.showFaXmark = false;
        this.bordeInpunt = false;
        this.msjEmail = '';
      }
      if (data == true) {
        this.registerForm.get('correo').setErrors({ valido: true });
        this.msjEmail = 'El correo ya se encuentra registrado';
        this.showFaXmark = true;
        this.showCheck = false;
      
      }
      if (this.registerForm.controls['correo'].hasError('pattern')) {
        this.msjEmail = '';
        this.showCheck = false;
      }
    })
  }
  msjPhone: string;
  showCheckPhone: boolean = false;
  showFaXmarkPhone: boolean = false;
  // bordeInpunt: boolean = false;
  verificarPhone(phone: any): void {
    
    phone = phone.target ? phone.target.value : phone;
    this.ApiService.validatePhone(phone).subscribe((data: any) => {

      if (data == false) {
        this.showCheckPhone = true;
        this.showFaXmarkPhone = false;
        this.msjPhone = '';
      }
      if (data == true) {
        this.registerForm.get('telefono').setErrors({ valido: true });
        this.msjPhone = 'El teléfono ya se encuentra registrado';
        this.showFaXmarkPhone = true;
        this.showCheckPhone = false;
      }
      if(this.registerForm.controls['telefono'].hasError('pattern')){
        this.showCheckPhone = false;
        this.msjPhone = '';
      }
    })
  }
  inputsize(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length > 12) {
      inputElement.value = inputElement.value.slice(0, 12);
      this.registerForm.get('identificacionDelRepresentanteLegal')?.setValue(inputElement.value);
    }
  }
  fnSubirFoto(event){
    
    /*if(this.avatarSeleccionado !== undefined && this.avatarSeleccionado != -1){
      const title = "Error de carga";
      const message = `Ya tiene un avatar seleccionado`;
      this.Message.showModal(title, message);
      return;
    }*/
    
    var imagenPrev:any="";
    var fileList:FileList=event.target.files;
    var file :File=fileList[0];

    if (event.target.files.length > 0) {
      const reader = new FileReader();
      const file = event.target.files[0]; // Obtener el archivo de la lista de archivos seleccionados

      // Leer el archivo y convertirlo a base64
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const image = new Image();

        image.onload = () => {
          const width = image.width;
          const height = image.height;

          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const title = "Error de carga";
            const message = `Las dimensiones del logo no deben exceder ${MAX_WIDTH}x${MAX_HEIGHT} píxeles.`;
            this.Message.showModal(title, message);
            this.imagenPrevisualizada="";
            this.imagenLogo.esAvatar=false;
            this.imagenLogo.logo="";
            //this.deshabilitarAvatars=false;
            return;
          }

          
        };
        
        this.imagenLogo.logo=base64Data;
        image.src = base64Data;
        this.imagenPrevisualizada=base64Data;
       // this.deshabilitarAvatars=true;
      };

      reader.readAsDataURL(file); // Leer el archivo como base64
    }
   
  }
  
  borrarImagen(){
    //this.deshabilitarAvatars=false;
    this.imagenPrevisualizada ='';
    //this.imagenLogo.esAvatar=false;
    this.imagenLogo.logo="";
    //this.avatarSeleccionado==undefined;
    //delete this.avatarSeleccionado;
    
  }
  VerModelo(){
   
   
  }
 
  obtenerAvatar(index: number) {
    if (this.avatarSeleccionado === index) {
      this.imagenLogo.esAvatar=false;
      delete this.avatarSeleccionado ;
      this.imagenLogo.idAvatar=-1;
      this.avatarSeleccionado != -1
    } else {
      this.avatarSeleccionado = index;
      this.imagenLogo.idAvatar=index+1;
      this.imagenLogo.esAvatar=true;
    }
    
  }

  isCheckboxDisabled(index: number): boolean {
  
    return this.avatarSeleccionado === null && this.avatarSeleccionado === index;
  }
  retroceder(){
    this.location.back();
  }
  bloquearEspacio(event:any){
    
    var keyCode = event.keyCode || event.which;
    if (keyCode === 32) {
      event.preventDefault();
    }

  }
}
