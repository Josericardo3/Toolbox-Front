import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-app-diagnostico-doc',
  templateUrl: './app-diagnostico-doc.component.html',
  styleUrls: ['./app-diagnostico-doc.component.css']
})
export class AppDiagnosticoDocComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

    generatePDF() {
    // const formData = this.formParent.value;
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

}
