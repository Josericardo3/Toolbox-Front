import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/servicios/api/api.service';
import { environment } from 'src/environments/environment.prod';
import 'core-js/es/object';

@Component({
  selector: 'app-app-caracterizacion',
  templateUrl: './app-caracterizacion.component.html',
  styleUrls: ['./app-caracterizacion.component.css']
})
export class AppCaracterizacionComponent implements OnInit {

  public formParent: FormGroup = new FormGroup({});

  public form: FormGroup = new FormGroup({});
  propiedades: string[] = [];
  datos: any=[];
  apiURL = environment.apiURL;
  dataSelect: any[] = [];

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
    
      // this.form = this.fb.group(this.datos || {});
      // this.propiedades = Object.keys(this.form.controls)
    
  }

  ngOnInit(): void {
    this.initFormParent();

    this.http.get('http://10.4.3.140:8050/api/Usuario/caracterizacion/1')
    .subscribe((data: any) => {
      this.datos = data;
      this.getTable(this.datos);
      console.log(data);
      console.log(this.datos);
     this.getSelect();
      const refSkills = this.formParent.get('campos') as FormArray;
      refSkills.push(this.intiFormSkill());

    });

  //   this.dataSelect = this.datos.campos
  // .filter((campo: { relations: string; }) => campo.relations && JSON.parse(campo.relations))
  // .flatMap((campo: { relations: string; }) => this.getTable(JSON.parse(campo.relations)))
  // .filter((elem: any) => elem);

    // this.http.get('/assets/datos.json')
    
    // this.http.get(`http://10.4.3.140:8050/api/Usuario/caracterizacion/`)
    // .subscribe((data: any) => {
    //   this.datos = data;
    //   console.log(data);
    //   console.log(this.datos);
    //   this.form = this.fb.group(data);
    //   this.propiedades = Object.keys(this.form.controls);
    // });
  }

   //-----------------EJEMPLO2----------------------
  //  onForm(){
  //   this.http.get(this.apiURL)
  //   .subscribe(data => {
  //     this.datos = data;
  //     console.log(data);
  //   })
  // }

  //--------------EJEMPLO1--------------------

  initFormParent(): void{
    this.formParent = new FormGroup(
      {
        id_user: new FormControl('', [Validators.required, Validators.minLength(5)]),
        campos: new FormArray([],[ Validators.required])

      })
  }

  //esta funcion retorna un nuevo grupo de formulario. Inicializa el formulario de los skills
  intiFormSkill(): FormGroup{
    return new FormGroup({
      // language: new FormControl(''),
      // projectUrl: new FormControl(''),
      // expYear: new FormControl('', [Validators.required])
    })
  }

  //addSkill usa intiFormSkill. Agrega el formulario al hacer clic en el boton
  // addSkills(){
    
  // }

  getSelect(){
    this.dataSelect = this.datos.campos
    .filter((campo: { relations: string; }) => campo.relations !== '{}' && campo.relations !== '')
    .flatMap((campo: { relations: any; }) => this.getTable(campo.relations))
    .reduce((prev: any, next: any) => prev.concat(next), []);

    // this.dataSelect = _.compact(this.datos.campos
      // .filter((campo: { relations: string; }) => campo.relations && JSON.parse(campo.relations))
      // .flatMap((campo: { relations: string; }) => this.getTable(JSON.parse(campo.relations)));

  //   this.dataSelect = this.datos.campos
  // .filter((campo: { relations: string; }) => campo.relations && JSON.parse(campo.relations))
  // .flatMap((campo: { relations: string; }) => this.getTable(JSON.parse(campo.relations)))
  // .filter((elem: any) => elem);

  //   this.dataSelect = this.datos.campos
  // .filter((campo: any) => campo.relations && JSON.parse(campo.relations))
  // .flatMap((campo: any) => this.getTable(JSON.parse(campo.relations)));

  }
  getTable(relations: any): any {
    if (typeof relations === 'string') {
      let table = JSON.parse(relations).table;
      return table;
    } else {
      return relations;
    }
  }
 

  getCtrl(key: string, form: FormGroup): any{
    return form.get(key);
  }

  // const json = JSON.stringify(data);
  //     console.log(json); 
  //     JSON.parse(json, (key, value) => {
  //       console.log(`value: -> ${value}`)

}
