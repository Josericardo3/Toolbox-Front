import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/servicios/api/api.service';
// import 'core-js/es/object';
import { ApiServiceService } from 'src/app/servicios/apiServiceForm/api-form-service.service';
import { FormServiceService } from 'src/app/servicios/formService/form-service.service';
import { Router } from '@angular/router';
import { Categoria } from '../../../utils/constants';
import { SpinnerService } from 'src/app/servicios/spinnerService/spinner.service';
import { NgxSpinnerModule } from 'ngx-spinner'; 
@Component({
  selector: 'app-app-caracterizacion',
  templateUrl: './app-caracterizacion.component.html',
  styleUrls: ['./app-caracterizacion.component.css']
})

export class AppCaracterizacionComponent implements OnInit {

  // checkbox!: ElementRef;
  // forms!: Form[];
  // public   forms!: Form[]: FormGroup = new FormGroup({});

  formParent!: FormGroup;
  datos: any = [];

  dataSelect!: any[];
  dataOption!: any[];
  dataNorma!: any[];

  otherChecked: boolean = false;
  showDependency: boolean | any= false;
  // // otherChecked: string | any;
  // selectedIndex: number = -1;
  // public checkboxStates: boolean[] = [];
  mostrarInput = false;
  idCaracterizacionDinamicaCondicion!: any;
  
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private webPattern: any = /^(http:\/\/www\.|http:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  constructor(
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private http: HttpClient,
    private apiForm: ApiServiceService,
    private formServiceService : FormServiceService,
    private router: Router,
    private spinnerService: SpinnerService,
    ) { 
      // this.formParent = new FormGroup({});
      this.formParent = this.formBuilder.group({});
}

  
  ngOnInit(): void {
    // this.http.get('http://10.4.3.140:8050/api/Usuario/caracterizacion/1')
    this.ApiService.getData(1) //para obtener datos de la api
    // this.http.get('https://www.toolbox.somee.com/api/Usuario/caracterizacion/1')
    // this.http.get('assets/datos.json')
    .subscribe((data: any) => {
      this.datos = data;
      this.datos.campos.forEach((campo:any) => {
        if(campo.values !== null){
          this.formParent.addControl(campo.ffcontext, new FormControl({value: campo.values, disabled: true}))
        }else{
          this.formParent.addControl(campo.ffcontext, new FormControl('', [Validators.required]))          
        }
      });
      this.createFormControls();

      // this.formValidator();

  });

    //EJEMPLO01
    // this.initFormParent();
    
    // this.http.get('http://10.4.3.140:8050/api/Usuario/caracterizacion/1')
    // .subscribe((data: any) => {
    //   this.datos = data;
    //   this.getTable(this.datos);
    //   console.log(data);
    //   console.log(this.datos);
    //   this.getSelect();
    //   const refSkills = this.formParent.get('campos') as FormArray;
    //   refSkills.push(this.intiFormSkill());
    // });
}

allFieldsFilled(): boolean {
  console.log(this.formParent.value); // imprime los valores de los campos del formulario
  const campos = Object.values(this.formParent.value);
  const lleno = campos.every(campo => typeof campo === 'string' && campo.trim() !== '');
  console.log(lleno); // imprime el valor booleano que se devuelve
  return lleno;
}

createFormControls() {
  for (let campo of this.datos.campos) {
    let control = this.getControlType(campo);
    // this.formParent.addControl(control.nombre, new FormControl(control.value));
    if(campo.tipodedato === "referencia_id"){
      this.dataSelect = this.datos.campos
      .filter((campo: { relations: string; }) => campo.relations !== '{}' && campo.relations !== '')
      .flatMap((campo: { relations: any; }) => this.getTable(campo.relations))
      .reduce((prev: any, next: any) => prev.concat(next), []);
    }
    if(campo.tipodedato === "option"){
      this.dataOption = campo.desplegable
      .filter((campo: { desplegable: string; }) => campo.desplegable !== '{}' && campo.desplegable !== '')
      .flatMap((campo: { desplegable: any; }) => this.getOption(campo.desplegable))
      .reduce((prev: any, next: any) => prev.concat(next), []);
      console.log(campo.desplegable)
    }
    if(campo.tipodedato === "norma"){
      this.dataNorma = this.datos.campos
      .filter((campo: { relations: string; }) => campo.relations !== '{}' && campo.relations !== '')
      .flatMap((campo: { relations: any; }) => this.getNorma(campo.relations))
      .reduce((prev: any, next: any) => prev.concat(next), []);
    }
    this.formParent.addControl(campo.campo_local, control);
  }
}
getTable(relations: any): any {
  if (typeof relations === 'string') {
    this.dataSelect = JSON.parse(relations).table;
    return this.dataSelect;
  } else {
    return relations;
  }
}

getOption(desplegable: any): any{
  if (typeof desplegable === 'string') {
    this.dataOption = JSON.parse(desplegable);
    return this.dataOption;
  } else {
    return desplegable;
  }
}
getNorma(relations: any): any {
  if (typeof relations === 'string') {
    this.dataNorma = JSON.parse(relations).table;
    return this.dataNorma;
  } else {
    return relations;
  }
}

getControlType(campo: any) {
  switch (campo.tipodedato) {
    case 'int':
      return new FormControl(campo.values);
    case 'local_reference_id':
      return new FormControl(campo.values);
    case 'referencia_id':
      return new FormControl(campo.values);
    case 'option':
      return new FormControl(campo.values);
    case 'string':
      return new FormControl(campo.values);
    case 'checkbox':
      return new FormControl(campo.values);
    case 'radio':
      return new FormControl(campo.values);
    case 'norma':
      return new FormControl(campo.values);
    default:
      return new FormControl('');
  }
}
valoresForm: any = [];
capturarValor(id: string | number, valor: any, idcaracterizaciondinamica: any) {
  const result = this.valoresForm.find((o: any) => o.id === id);
  if (result) {
    result.valor = valor;
  }else{
    this.valoresForm.push({
      "id": id,
      "valor": valor,
      "idUsuarioPst": localStorage.getItem('Id'),
      "idCategoriaRnt": 1,
      "idCaracterizacion": 1
    });
  }


  console.log(this.valoresForm[id], 'capturar valor')
}

hasDepency(id: number) {
  const campos = this.datos.campos;
  const dictionay = new Map(campos.map(d => [d.idcaracterizaciondinamica, d]));
  return dictionay.has(+id);
}
// saveForm(){
   //melissa prueba
//    const values = this.datos.campos.forEach((dato: any) => {
//    console.log(this.formParent.get('categoriarnt')?.value,"campo prueba")
//     if(dato.values !== null){
//       console.log(dato,"dato nuevo",this.formParent)
//       console.log(dato.campo_local)
//       this.formParent.get(dato.campo_local)?.value
//     } 
//     });
  
//     const request={
//       categoria:values,
//     }

// console.log(request,"este es el request")

// }
  numOfFields!: number;
// saveForm(request:FormGroup){
  saveForm(){
    debugger
    this.ApiService.saveData(this.valoresForm)
    .subscribe((data: any) => {
      console.log(data, 'new data')
      this.router.navigate(['/dashboard'])
    })


    // const datos = {
    //   valorInput: this.valorInput,
    //   valorSelect: this.valorSelect
    // };
    // this.ApiService.saveData(this.valoresForm)
    // .subscribe((data: any) => {
    //   console.log(data, 'new data')
    //   if (data.statusCode === 201) {
    //     this.router.navigate(['/dashboard'])
    //   }
    // })







    // const request = {
    //   number: this.formParent.get('campo.campo_local')?.value,
    //   local_reference_id: this.formParent.get('campo.campo_local')?.value,
    //   string: this.formParent.get('campo.campo_local')?.value,
    // }
    // return this.ApiService.saveData(request)
    // .subscribe((data: any) => {
    //   console.log(data, 'new data')
    //   if (data.statusCode === 201) {
    //     this.router.navigate(['/dashboard'])
    //   }
    // })

//     if (this.formParent && this.formParent.controls) {
//       for (let i = 0; i < this.numOfFields; i++) {
//   this.formParent.get(`campo-${i}`).valueChanges.subscribe(value => {
//     console.log(value);
//   });
// }
//     }
    
  // const request = {formparent: this.formParent}
  // return this.ApiService.saveData(request)
  // .subscribe((data: any) => {
  //   console.log(data, 'new data')
  //   if (data.statusCode === 201) {
  //     this.router.navigate(['/dashboard'])
  //   }
  // })



  // const formData = request.value
  
  //   this.ApiService.saveData(formData)
  //   .subscribe((response:any) => {
  //     console.log(response)
  //     if (response.statusCode === 201) {
  //           this.router.navigate(['/dashboard'])
  //         }
  //   })

}

  //--------------EJEMPLO1--------------------

  // initFormParent(): void{
  //   this.formParent = new FormGroup({
  //     // id_user: new FormControl('', [Validators.required, Validators.minLength(5)]),
  //     campos: new FormArray([], [ Validators.required])
  //   });
  // }

  // //esta funcion retorna un nuevo grupo de formulario. Inicializa el formulario de los skills
  // intiFormSkill(): FormGroup{
  //   return new FormGroup({
  //     c0: new FormControl('', [Validators.required]),
  //     c2: new FormControl('', [Validators.required]),
  //     c3: new FormControl('', [Validators.required]),
  //     c4: new FormControl('', [Validators.required]),
  //     c5: new FormControl('', [Validators.required]),
  //     c6: new FormControl('', [Validators.required]),
  //   })
  // }

  // //addSkill usa intiFormSkill. Agrega el formulario al hacer clic en el boton
  // // addSkills(){ }

  // getCtrl(key: string, form: FormGroup): any{
  //   return form.get(key);
  // }

}
