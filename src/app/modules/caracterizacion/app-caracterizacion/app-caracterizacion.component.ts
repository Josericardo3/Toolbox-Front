import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/servicios/api/api.service';
// import 'core-js/es/object';
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
  mostrarInput = false;
  idCaracterizacionDinamicaCondicion!: any;

  categoriaRNTValues: string;
  
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private webPattern: any = /^(http:\/\/www\.|http:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  constructor(
    private formBuilder: FormBuilder,
    private ApiService: ApiService,
    private http: HttpClient,
    private router: Router,
    private spinnerService: SpinnerService,
    ) { 
      // this.formParent = new FormGroup({});
      this.formParent = this.formBuilder.group({});
      
}

  
  ngOnInit(): void {
    // this.http.get('http://10.4.3.140:8050/api/Usuario/caracterizacion/1')
    this.ApiService.getData() //para obtener datos de la api
    // let id = localStorage.getItem("Id");
    // this.http.get('https://www.toolbox.somee.com/api/Usuario/caracterizacion/'+id)
    // this.http.get('assets/datos.json')
    .subscribe((data: any) => {
      this.datos = data;
      const campoCategoriaRNT = this.datos.campos.find(campo => campo.nombre === 'Categoría RNT');

      // Obtiene el valor de "values" de "nombre": "Categoría RNT"
      this.categoriaRNTValues = campoCategoriaRNT.values;
      console.log(this.categoriaRNTValues);

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

  // const campo = this.datos.campos;
  // this.categoriaRNT = campo.find((campo: any) => campo.nombre === 'Categoría RNT').values;
  //     console.log(campo, this.categoriaRNT)

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
    this.ApiService.saveData(this.valoresForm)
    .subscribe((data: any) => {
      console.log(data, 'new data')
      this.router.navigate(['/dashboard'])
    })
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
