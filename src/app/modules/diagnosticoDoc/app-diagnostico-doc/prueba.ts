// generateDiagnostico() {
//     const pdfDefinition: any = {
//       content: [
//         {
//           table: {
//             body: [
//               [
//                 {text: '3. Resultados del diagnóstico', alignment: 'center', bold: true, colSpan: 5},
//                 {},
//                 {},
//                 {},
//                 {}
//               ],
//               [
//                 {text: 'numeral', colSpan: 5},
//                 {},
//                 {},
//                 {},
//                 {}
//               ],
//               [
//                 'Cumplimiento',
//                 'No Aplica',
//                 'No Cumple',
//                 'Cumple Parcialmente',
//                 'Cumple'
//               ],
//               [
//                 'porcentajeNC',
//                 'numeroRequisitoNA',
//                 'numeroRequisitoNC',
//                 'numeroRequisitoCP',
//                 'numeroRequisitoC'
//               ],
//               [
//                 {text: 'Requisito', alignment: 'center', bold: true },
//                 {text: 'Calificación', alignment: 'center', bold: true },
//                 {text: 'Observaciones', alignment: 'center', bold: true, colSpan: 3 },
//                 {},
//                 {}
//               ],
//               [
//                 {text: 'requisito', alignment: 'center', bold: true },
//                 {text: 'calificado', alignment: 'center', bold: true },
//                 {text: 'evidencia', alignment: 'center', bold: true, colSpan: 3 },
//                 {},
//                 {}
//               ],
//             ]
//           },
//         }
//       ],
//     }
//     pdfMake.createPdf(pdfDefinition).download('Informe_de_diagnóstico.pdf');
//   }

// generateDiagnostico() {
//     const json = { /* Aquí va el JSON de la API */ };
  
//     const body = [    
//       [      { text: '3. Resultados del diagnóstico', alignment: 'center', bold: true, colSpan: 5 },      {},      {},      {},      {}    ],
//       [      { text: 'numeraltitulo', colSpan: 5 },      {},      {},      {},      {}    ],
//       [      'Cumplimiento',      'No Aplica',      'No Cumple',      'Cumple Parcialmente',      'Cumple'    ],
//       [      
//         'porNC',      
//         'numeroNA',      
//         'numeroNC',      
//         'numeroCP',      
//         'numeroC'    ],
//       [      { text: 'Requisito', alignment: 'center', bold: true },      { text: 'Calificación', alignment: 'center', bold: true },      { text: 'Observaciones', alignment: 'center', bold: true, colSpan: 3 },      {},      {}    ],
//       [      
//         { text: 'req', alignment: 'center', bold: true },      
//         { text: 'cal', alignment: 'center', bold: true },      
//         { text: 'evi', alignment: 'center', bold: true, colSpan: 3 },      
//         {},      
//         {}    ]
//     ];
  
//     // Recorrer el arreglo 'agrupacion' del JSON para agregar las filas correspondientes a la tabla
//     json.agrupacion.forEach(agrupacion => {
//       body.push([
//         agrupacion.listacampos[0].numeral,
//         {},
//         {},
//         {},
//         {}
//       ]);
  
//       // Asignar los valores correspondientes a las variables
//       const numeraltitulo = agrupacion.listacampos[0].numeral;
//       const porNC = agrupacion.porcentajeNC;
//       const numeroNA = agrupacion.numeroRequisitoNA;
//       const numeroNC = agrupacion.numeroRequisitoNC;
//       const numeroCP = agrupacion.numeroRequisitoCP;
//       const numeroC = agrupacion.numeroRequisitoC;
//       const req = agrupacion.listacampos[0].requisito;
//       const cal = agrupacion.listacampos[0].calificado;
//       const evi = agrupacion.listacampos[0].evidencia;
  
//       body.push([
//         numeraltitulo,
//         {},
//         {},
//         {},
//         {}
//       ],
//       [
//         porNC,
//         numeroNA,
//         numeroNC,
//         numeroCP,
//         numeroC
//       ],
//       [
//         req,
//         cal,
//         evi,
//         {},
//         {}
//       ]);
//     });
  
//     const pdfDefinition = {
//       content: [
//         {
//           table: {
//             body: body
//           }
//         }
//       ]
//     };
  
//     pdfMake.createPdf(pdfDefinition).download('Informe_de_diagnóstico.pdf');
//   }
  

// generateDiagnostico() {
//     const pdfDefinition: any = {
//       content: [
//         {
//           table: {
//             body: [
//               [
//                 {text: '3. Resultados del diagnóstico', alignment: 'center', bold: true, colSpan: 5},
//                 {},
//                 {},
//                 {},
//                 {}
//               ]
//             ]
//           }
//         }
//       ]
//     };

//     const tableBody = pdfDefinition.content[0].table.body; // Acceder al cuerpo de la tabla en el PDF

//     this.datosD.agrupacion.forEach(agrupacion => {
//       const fila = [        { text: agrupacion.listacampos[0].numeral, colSpan: 5, bold: true },
//         {},
//         {},
//         {},
//         {}
//       ];

//       tableBody.push(fila);

//       tableBody.push([
//         'Cumplimiento',
//         'No Aplica',
//         'No Cumple',
//         'Cumple Parcialmente',
//         'Cumple'
//       ]);

//       tableBody.push([
//         agrupacion.porcentajeNC,
//         agrupacion.numeroRequisitoNA,
//         agrupacion.numeroRequisitoNC,
//         agrupacion.numeroRequisitoCP,
//         agrupacion.numeroRequisitoC
//       ]);

//       tableBody.push([
//         {text: 'Requisito', alignment: 'center', bold: true },
//         {text: 'Calificación', alignment: 'center', bold: true },
//         {text: 'Observaciones', alignment: 'center', bold: true, colSpan: 3 },
//         {},
//         {}
//       ]);

//       tableBody.push([
//         {text: agrupacion.listacampos[0].requisito, alignment: 'center', bold: true },
//         {text: agrupacion.listacampos[0].calificado, alignment: 'center', bold: true },
//         {text: agrupacion.listacampos[0].evidencia, alignment: 'center', colSpan: 3 },
//         {},
//         {}
//       ]);

//       agrupacion.listacampos.slice(1).forEach(campo => {
//         tableBody.push([
//           campo.requisito,
//           campo.calificado,
//           {text: campo.evidencia, colSpan: 3 },
//           {},
//           {}
//         ]);
//       });
//     });

//     // pdfMake.createPdf(pdfDefinition).download('Informe_de_diagnóstico.pdf');
// }




// generateDiagnostico() {
//     const pdfDefinition: any = {
//       content: [
//         {
//           table: {
//             body: [
//               [
//                 { text: '3. Resultados del diagnóstico', alignment: 'center', bold: true, colSpan: 5 },
//                 {},
//                 {},
//                 {},
//                 {}
//               ],
//               [              { text: 'numeraltitulo', colSpan: 5 },              {},              {},              {},              {}            ],
//               [              'Cumplimiento',              'No Aplica',              'No Cumple',              'Cumple Parcialmente',              'Cumple'            ],
//               [              'porNC',              'numeroNA',              'numeroNC',              'numeroCP',              'numeroC'            ],
//               [              { text: 'Requisito', alignment: 'center', bold: true },              { text: 'Calificación', alignment: 'center', bold: true },              { text: 'Observaciones', alignment: 'center', bold: true, colSpan: 3 },              {},              {}            ],
//               [              { text: 'req', alignment: 'center', bold: true },              { text: 'cal', alignment: 'center', bold: true },              { text: 'evi', alignment: 'center', bold: true, colSpan: 3 },              {},              {}            ],
//             ]
//           },
//         }
//       ],
//     };
    
//     // Loop through the objects in the 'agrupacion' array and add a new row to the table body for each object
//     this.datosD.agrupacion.forEach(obj => {
//       pdfDefinition.content[0].table.body.push([
//         { text: obj.numeral, colSpan: 5 },
//         {},
//         {},
//         {},
//         {}
//       ]);
//       pdfDefinition.content[0].table.body.push([
//         obj.porcentajeNC,
//         obj.numeroRequisitoNA,
//         obj.numeroRequisitoNC,
//         obj.numeroRequisitoCP,
//         obj.numeroRequisitoC
//       ]);
//       pdfDefinition.content[0].table.body.push([
//         { text: obj.requisito, alignment: 'justify' },
//         { text: obj.calificado },
//         { text: obj.evidencia, colSpan: 3 },
//         {},
//         {}
//       ]);
//     });
  
//     // pdfMake.createPdf(pdfDefinition).download('Informe_de_diagnóstico.pdf');
//   }
  
