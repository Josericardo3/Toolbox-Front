import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/servicios/api/api.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-app-caracterizacion',
  templateUrl: './app-caracterizacion.component.html',
  styleUrls: ['./app-caracterizacion.component.css']
})
export class AppCaracterizacionComponent implements OnInit {

  public formParent: FormGroup = new FormGroup({});

  form: FormGroup;
  propiedades: string[];
  datos: any;
  apiURL = environment.apiURL;

  constructor(
    private fb: FormBuilder,
    private ApiService: ApiService,
    private http: HttpClient
    ) { 
      //--------------EJEMPLO2--------------------
      // this.http.get('https://mi-api.com/datos.json').subscribe(data => 
      // {
      //   this.datos = data;
      // });
    
      this.form = this.fb.group(this.datos);
      this.propiedades = Object.keys(this.form.controls);
  }

  ngOnInit(): void {
    // this.initFormParent();
  }

   //-----------------EJEMPLO2----------------------
   onForm(){
    this.http.get(this.apiURL)
    .subscribe(data => {
      this.datos = data;
      console.log(data);
    })
  }

  //--------------EJEMPLO1--------------------

  // initFormParent(): void{
  //   this.formParent = new FormGroup(
  //     {
  //       name: new FormControl('', [Validators.required, Validators.minLength(5)]),
  //       skills: new FormArray([], [Validators.required])

  //     })
  // }

  // //esta funcion retorna un nuevo grupo de formulario. Inicializa el formulario de los skills
  // intiFormSkill(): FormGroup{
  //   return new FormGroup({
  //     language: new FormControl(''),
  //     projectUrl: new FormControl(''),
  //     expYear: new FormControl('', [Validators.required])
  //   })
  // }

  // //addSkill usa intiFormSkill. Agrega el formulario al hacer clic en el boton
  // addSkills(){
  //   const refSkills = this.formParent.get('skills') as FormArray;
  //   refSkills.push(this.intiFormSkill())
  // }

  // getCtrl(key: string, form: FormGroup): any{
  //   return form.get(key);
  // }

  // // const json = JSON.stringify(data);
  // //     console.log(json); 
  // //     JSON.parse(json, (key, value) => {
  // //       console.log(`value: -> ${value}`)

}
