import {
  Component,
  OnInit,
  ComponentFactoryResolver,
} from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms'
import { CustomValidators } from '../../../models/customeValidator'
import { ApiService } from '../../../servicios/api/api.service'
import { Store } from '@ngrx/store'
import 'jquery-ui/ui/widgets/dialog.js'
import { Categoria } from '../../../utils/constants'



@Component({
  selector: 'app-app-register',
  templateUrl: './app-register.component.html',
  styleUrls: ['./app-register.component.css'],
})
export class AppRegisterComponent implements OnInit {
  password: string = '';
  repeatPassword: string = '';
  showPassword: boolean = false;
  showRepeatPassword: boolean = false;

  // telefono = new FormControl('', [
  //   Validators.required,
  //   Validators.pattern(/^\d{10}$/)
  // ])
  telefonoDelRepresentanteLegal = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{10}$/)
  ])
  telefonoDelResponsableDeSostenibilidad = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{10}$/)
  ])

  showModalSuccess:any
  data: any
  arrAgency: any
  public registerForm!: FormGroup
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //private telefonoPattern: any = /^\d{10}$/
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private ComponentFactoryResolver: ComponentFactoryResolver,
    public ApiService: ApiService,
    private categoria: Categoria,
    private store: Store<{ dataLogin: any }>,
  ) {}

  ngOnInit(): void {
    localStorage.removeItem("newUser")
    this.data = this.categoria.name.tipo
    this.setDepartments('')
    this.registerForm = this.formBuilder.group(
      {
        telefono:[
          '',
          Validators.compose([ 
            Validators.required,
            Validators.pattern(/^\d{10}$/)]),
        ],
        telefonoDelRepresentanteLegal :['', 
          Validators.compose([ 
          Validators.required,
          Validators.pattern(/^\d{10}$/)]),
        ],
        telefonoDelResponsableDeSostenibilidad:['', 
        Validators.compose([ 
        Validators.required,
        Validators.pattern(/^\d{10}$/)]),
        ],
        numeroDeIdentificacionTributaria: ['', Validators.required],
        registroNacionalDeTurismo: ['', Validators.required],
        categoriaRnt: ['', Validators.required],
        subcategoriaRnt: ['', Validators.required],
        nombreDelPst: ['', Validators.required],
        razonSocialDelPst: ['', Validators.required],
        correo: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],
        //telefonoDelPst:['', Validators.required],
       
        nombreDelRepresenteLegal: ['', Validators.required],
        correoRepresentanteLegal: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],
        //telefonoDelRepresentanteLegal: ['', Validators.required],
        tipoDeIdentificacionDelRepresentanteLegal: ['', Validators.required],
        identificacionDelRepresentanteLegal: ['', Validators.required],
        departamento: ['', Validators.required],
        municipio: ['', Validators.required],
        correoDelResponsableDeSostenibilidad: [
          '',
          Validators.compose([
            Validators.pattern(this.emailPattern),
            Validators.required,
          ]),
        ],
        //telefonoDelResponsableDeSostenibilidad: ['', Validators.required],
        nombreDelResponsableDeSostenibilidad: ['', Validators.required],
        password1: [
          '',
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(/\d/, { hasNumber: true }),
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
            CustomValidators.patternValidator(/(?=.*?[#?!@$%^&*-])/, {
              hasSpecialCharacters: true,
            }),
            Validators.minLength(8),
            Validators.maxLength(12),
          ]),
        ],
        confirmPassword: ['', Validators.compose([Validators.required])],
        checkbox: ['', Validators.required],
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.comparePassword,
      },
    )
  }


  onLoadCategory(evt: any) {
    //console.log(evt.target.options.selectedIndex, 'categoria valor')
    //console.log(this.data, 'data', this.categoria)
    const filterCategory = this.categoria.name.agencias.filter(
      (agency: { id_categoria: number; name: string }) =>
        agency.id_categoria === evt.target.options.selectedIndex
    )
 
    this.arrAgency = filterCategory.sort();
   
    return this.arrAgency;
    //console.log(this.registerForm, 'registronuevo')
    //console.log(filterCategory,"filtro")
  }

  setDepartments(evt: any) {
    let departments: any[] = [];
    let departmentsCode: any[] = [];
    //console.log(evt?.target?.value,"departa");
    let select = document.getElementById(
      'selectDepartment',
    ) as HTMLSelectElement
    //console.log(select.options, 'opciones', select.options.length)
    if (select.options.length === 0) {
      fetch('https://www.datos.gov.co/resource/gdxc-w37w.json')
        .then((response) => response.json())
        .then((data) => {
          // esta linea llena el array
          if (select != null && departments.length === 0) {
            departments = Array.from(
              new Set(data.map((item: any) => {
                //console.log(item,"nuevoItem")
                return item.dpto
              })),
            )
            departmentsCode = Array.from(
              new Set(data.map((item: any) => {
                //console.log(item,"nuevoItem")
                return item.cod_depto
              })),
            )
            select.add(new Option('Seleccione un departamento', '0'))
            departments.forEach((item: any,index) => {
              let option = document.createElement('option')
              option.id = departmentsCode[index]
              //console.log(item,"item")
              option.text = item
              //console.log(option,"option")
              select.add(option)

            })
           
          }
        })
    }
    this.setMunicipalities(evt?.target?.value)
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
    fetch('https://www.datos.gov.co/resource/gdxc-w37w.json')
      .then((response) => response.json())
      .then((data) => {
        arrFilterMpio = data.filter(
          (item: any) => item.dpto === selectedDepartament,
        )
        //console.log('municipalidad', arrFilterMpio)
        let select = document.getElementById(
          'selectMunicipality',
        ) as HTMLSelectElement
        if (select != null) {
          select.add(new Option('Seleccione un municipio', '0'))
          arrFilterMpio.forEach((item: any, index: any) => {
            let option = document.createElement('option')
            option.text = item.nom_mpio
            select.add(option)
          })
        }
      })
  }

  seePasswordRegister() {
    const passRegister = document.querySelector(
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
    }
  }

  seePasswordRegister2() {
    const passRegister2 = document.querySelector(
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
    }
  }

  openModal() {
    const modal = document.querySelector('#modalTerminos') as HTMLInputElement
    modal.classList.add('active')
  }

  closeModal(evt: any) {
    console.log(this.registerForm,"aca esta el errror")
    evt.defaultPrevented
    // console.log(evt, 'evt')
    const modal = document.querySelector('#modalTerminos') as HTMLInputElement
    modal.classList.remove('active');
    this.registerForm.controls['checkbox'].setValue(true);
    //this.VendedorForm.controls['identidad'].setValue(response.body.data.identidad);
    
  }

  saveUser() {
    //console.log(this.registerForm.get("departamento"), 'valores')
    const request = {
      //usuariopst: this.registerForm.get('categoriaRnt')?.value.id,
      nit: this.registerForm.get("numeroDeIdentificacionTributaria")?.value,
      rnt: this.registerForm.get("registroNacionalDeTurismo")?.value,
      idCategoriaRnt: this.registerForm.get("categoriaRnt")?.value.id,
      idSubCategoriaRnt: this.registerForm.get("subcategoriaRnt")?.value.id,
      nombrePst: this.registerForm.get("nombreDelPst")?.value,
      razonSocialPst: this.registerForm.get("razonSocialDelPst")?.value,
      correoPst: this.registerForm.get("correo")?.value,
      telefonoPst: this.registerForm.get("telefono")?.value,
      nombreRepresentanteLegal: this.registerForm.get(
        "nombreDelRepresenteLegal",
      )?.value,
      correoRepresentanteLegal: this.registerForm.get(
        "correoRepresentanteLegal",
      )?.value,
      telefonoRepresentanteLegal: this.registerForm.get("telefonoDelRepresentanteLegal")?.value,
      idTipoIdentificacion: 1,//modificado
      identificacionRepresentanteLegal: this.registerForm.get(
        "identificacionDelRepresentanteLegal",
      )?.value,
      departamento:this.registerForm.get("departamento")?.value,
      municipio:this.registerForm.get("municipio")?.value,
      nombreResponsableSostenibilidad: this.registerForm.get(
        "nombreDelResponsableDeSostenibilidad",
      )?.value,
      correoResponsableSostenibilidad: this.registerForm.get(
        "correoDelResponsableDeSostenibilidad",
      )?.value,
      telefonoResponsableSostenibilidad: this.registerForm.get("telefonoDelResponsableDeSostenibilidad")?.value,
      password: this.registerForm.get("password1")?.value,
      idTipoAvatar: 1,
    }
        localStorage.setItem("newUser",'yes')
        const modalInicial = document.querySelector("#modal-success") as HTMLElement;
        modalInicial.style.display = "block";
    //console.log(request, 'newrequest')
    return this.ApiService.createUser(request).subscribe((data: any) => {
      if (data.statusCode === 201) {
         this.router.navigate(['/']); 
       
      }
      
    })
  }

  change(evt:any){
    const btnAceptar = document.querySelector('#btnAceptar') as HTMLInputElement
    if(btnAceptar.getAttribute('disabled')===null){
      return btnAceptar.setAttribute("disabled",'');
    }else{
      return btnAceptar.removeAttribute("disabled");
    }
  }

  //prueba limpiar(){
  // this.registerForm.reset();
  // }
}
