import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-app-diagnostico',
  templateUrl: './app-diagnostico.component.html',
  styleUrls: ['./app-diagnostico.component.css']
})
export class AppDiagnosticoComponent implements OnInit {

  formParent!: FormGroup;
  datos: any = [];

  valorSeleccionado: string = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) { 
    this.formParent = new FormGroup({});
  }

  ngOnInit(): void {

    this.formParent = this.fb.group({
      campos: this.fb.array([])
    });

    this.http.get('https://www.toolbox.somee.com/api/Usuario/Diagnostico/5')
    .subscribe((data: any) => {
      this.datos = data;
      this.datos.campos.forEach((campo:any) => {
        if(campo.values !== null){
          this.formParent.addControl(campo.campo_local, new FormControl({value: campo.values, disabled: true}, Validators.required))
        }else{
          this.formParent.addControl(campo.campo_local, new FormControl('', Validators.required))
        }
      });
  });
  }

  addCampo(numeralprincipal: string, numeralespecifico: string, titulo: string, requisito: string) {
    const campo = this.fb.group({
      numeralprincipal: [numeralprincipal, Validators.required],
      numeralespecifico: [numeralespecifico, Validators.required],
      titulo: [titulo, Validators.required],
      requisito: [requisito, Validators.required]
    });
  
    this.campos.push(campo);
  }

  get campos() {
    return this.formParent.get('campos') as FormArray;
  }
  
  getControlType(campo: any) {
    switch (campo.tipodedato) {
      case 'string':
        return new FormControl(campo.values);
      case 'radio':
        return new FormControl(campo.values);
      case 'textarea':
        return new FormControl(campo.values);
      default:
        return new FormControl('');
    }
  }

  generatePDF() {
    const formData = this.formParent.value;
    const tableData = [  ['Nombre', 'Apellido', 'Edad'],
                         ['Juan', 'Pérez', 30],
                         ['María', 'Rodríguez', 25],
                      ];
    const docDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: [100, '*', 100],
            body: tableData
          }
        }
      ]
    };

    pdfMake.createPdf(docDefinition).download();

  }
  

  saveForm(){
    console.log('guardar formulario');
    this.router.navigate(['/dashboard']);
  }

}
