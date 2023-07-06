import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { ApiService } from 'src/app/servicios/api/api.service';

@Component({
  selector: 'app-app-matriz-partes-interesadas',
  templateUrl: './app-matriz-partes-interesadas.component.html',
  styleUrls: ['./app-matriz-partes-interesadas.component.css']
})
export class AppMatrizPartesInteresadasComponent implements OnInit{

  datosUsuario: any = [];
  datos: any = [];
  pst: any;
  logo: any;

  constructor(private api: ApiService,){}

  ngOnInit(){
    this.usuario();
  }

  usuario(){
    this.api.getUsuario()
    .subscribe((data: any) => {
      this.datosUsuario = data;
      this.pst = data.NOMBRE_PST;
      this.logo = data.LOGO
    })
  }

  generatePDF(){
    const pdfDefinition: any = {
      header: {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [     
              { image: this.logo, fit:[50, 50], alignment: 'center', margin:[ 0,3, 0,3 ], rowSpan: 2 },
              { text: this.pst, alignment: 'center', margin:[ 0, 21, 0, 21 ], rowSpan: 2},
              { text: 'PARTES INTERESADAS', alignment: 'center',rowSpan: 2, margin:[ 0,9,0,9 ] },
              { text: 'CÓDIGO:', alignment: 'center' }
            ],
            [
              {},
              {},
              '',
              { text: 'VERSIÓN:', alignment: 'center', margin:[ 0, 12, 0, 12 ] },
            ]
          ]
        },
        margin:[ 45, 8, 45, 8 ],
        fontSize: 11,
      },
      pageSize: {
        width: 794,
        height: 1123,
      },
      pageMargins: [ 45, 80, 45, 80 ],
      content: [
          
      ],
      styles: {
      }
    }
    pdfMake.createPdf(pdfDefinition).download('Matriz_partes_interesadas.pdf');
  }

  capturarValor(event: Event) {
  }

  saveForm(){  
  }
}
