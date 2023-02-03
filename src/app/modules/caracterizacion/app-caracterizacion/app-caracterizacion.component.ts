import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/servicios/api/api.service';
import 'core-js/es/object';
import { ApiServiceService } from 'src/app/servicios/apiServiceForm/api-form-service.service';
import { FormServiceService } from 'src/app/servicios/formService/form-service.service';
import { Router } from '@angular/router';

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
  formService = {
    id: ''
  }
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

  constructor(
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private http: HttpClient,
    private apiForm: ApiServiceService,
    private formServiceService : FormServiceService,
    private router: Router,
    ) { 
      // this.formParent = new FormGroup({});
      this.formParent = this.formBuilder.group({});
}
    
  
  ngOnInit(): void {
    // this.http.get('http://10.4.3.140:8050/api/Usuario/caracterizacion/1')
    // this.apiForm.getData(this.formService)
    this.http.get('https://www.toolbox.somee.com/api/Usuario/caracterizacion/1')
    // this.http.get('assets/datos.json')
    .subscribe((data: any) => {
      this.datos = data;
      console.log(data);
      this.datos.campos.forEach((campo:any) => {
        if(campo.values !== null){
          this.formParent.addControl(campo.campo_local, new FormControl({value: campo.values, disabled: true}))
        }else{
          this.formParent.addControl(campo.campo_local, new FormControl('', [Validators.required]))
        }
      });
      this.createFormControls();
      // this.formValidator();
  });

  // let id = this.findCondicionId();
  //   if (id) {
  //     this.showDependency = this.datos.campos.dependiente === id;
  //   }
  
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

// private findCondicionId(): number {
//   let condicion = this.datos.campos.find((x:any) => x.mensaje === 'condicion');
//   return condicion ? condicion.idcaracterizaciondinamica : null;
// }

// formValidator = (form: FormGroup | any) => {
//   const controls = form.controls;
//   const keys = Object.keys(controls);
//   for (const key of keys) {
//     if (!controls[key].value) {
//       return { fieldsNotCompleted: true };
//     }
//   }
//   return null;
// };

// formValidator(){
//   this.formParent.valueChanges
//   .subscribe(() => {
//     let isValid = true;
//     for (let key in this.formParent.controls) {
//       if (this.formParent.controls[key].invalid) {
//         isValid = false;
//       }
//     }
//     this.formParent.updateValueAndValidity();
//     if (isValid) {
//       // habilitar botón
//       console.log('habilitar botón');
//     } else {
//       // deshabilitar botón
//       console.log('deshabilitar botón');
//     }
//   });
// }

// handleRadioClick(value:any) {
//   if (value === 16) {
//     this.isDependentVisible = true;
//   } else {
//     this.isDependentVisible = false;
//   }
// }
// showDependency: boolean | string | null= false;



// onChange(idcaracterizaciondinamica: string, event: any) {
//   if (event.target.value === 'true') {
//     this.showDependency = idcaracterizaciondinamica;
//   } else {
//     this.showDependency = false;
//   }
// }

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
      // .flatMap((campo: { desplegable: any; }) => this.getOption(campo.desplegable))
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

  


saveButtonDisabled = true;
saveForm(){
       this.router.navigate(['/dashboard']);
   // this.datos.campos.forEach((campo:any) => {
   //   if(this.formParent.get(campo)?.valid){
   //     //el boton debe activarse
   //     this.formParent.statusChanges.subscribe(status => {
   //       // this.saveButtonDisabled = status === 'INVALID';
   //       console.log("El campo name esta completo", status);
   //     });
   //   }else{
   //    //bloqueado
   //    this.formParent.statusChanges.subscribe(status => {
   //     // this.saveButtonDisabled = status === 'VALID';
   //     console.log("El campo name esta vacio", status);
   //   });
   //   }
   // });
   console.log('/dashboard');
     this.apiForm.submitForm(this.formService)
     .subscribe((response) => {
       console.log(response);
     }, (error) => {
       console.log(error);
     });
     // this.formServiceService.addFormData(this.formService)
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

  // getSelect(){
  //   this.dataSelect = this.datos.campos
  //   .filter((campo: { relations: string; }) => campo.relations !== '{}' && campo.relations !== '')
  //   .flatMap((campo: { relations: any; }) => this.getTable(campo.relations))
  //   .reduce((prev: any, next: any) => prev.concat(next), []);

  //   // this.dataSelect = _.compact(this.datos.campos
  //     // .filter((campo: { relations: string; }) => campo.relations && JSON.parse(campo.relations))
  //     // .flatMap((campo: { relations: string; }) => this.getTable(JSON.parse(campo.relations)));

  // //   this.dataSelect = this.datos.campos
  // // .filter((campo: { relations: string; }) => campo.relations && JSON.parse(campo.relations))
  // // .flatMap((campo: { relations: string; }) => this.getTable(JSON.parse(campo.relations)))
  // // .filter((elem: any) => elem);

  // //   this.dataSelect = this.datos.campos
  // // .filter((campo: any) => campo.relations && JSON.parse(campo.relations))
  // // .flatMap((campo: any) => this.getTable(JSON.parse(campo.relations)));

  // }


  // showInputField = '';

  // showInput(value: string) {
  //   if (value === 'OTRO') {
  //     this.showInputField = value;
  //   } else {
  //     this.showInputField = '';
  //   }
  // }



  // getCtrl(key: string, form: FormGroup): any{
  //   return form.get(key);
  // }

}
