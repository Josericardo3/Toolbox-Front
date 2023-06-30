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
  

// generateListaChequeo(){
//     const pdfDefinition: any = {
//       pageSize: {
//         width: 794,
//         height: 1123,
//       },
//       pageMargins: [ 30, 30, 30, 30 ],
//       content: [
//         {
//           table: {
//             widths: [ 80, 85, 'auto', 'auto','auto', 'auto' ],
//             body: [
//               [
//                 {text: 'Numeral', style: ['tituloDinamico']},
//                 {text: 'Titulo del requisito', style: ['tituloDinamico']},
//                 {text: 'Requisito', style: ['tituloDinamico']},
//                 {text: 'Posible evidencia', style: ['tituloDinamico']},
//                 {text: 'Calificación', style: ['tituloDinamico']},
//                 {text: 'Observaciones', style: ['tituloDinamico']},
//               ],
//               // Aquí va el título NUMERAL
//               ...this.datos.calificacion.map((item: any) => [
//                 {text: item.numeral, style: [ 'dinamicTable' ]},
//                 {text: item.tituloRequisito, style: [ 'dinamicTable' ]},
//                 {text: item.requisito, fontSize: 10},
//                 {text: item.evidencia, fontSize: 10},
//                 {text: item.calificado, style: [ 'dinamicTable' ]},
//                 {text: item.observacion, style: [ 'dinamicTable' ]}
//               ]),
//             ]
//           }
//         }
//       ],
//       styles: { 
//       tituloDinamico: {
//         alignment: 'center', 
//         bold: true,
//         fontSize: 10,
//       },
//       dinamicTable: {
//         fontSize: 10,
//         alignment: 'center'
//       }
//       }
//     }
//   }

  // generatePlanMejora(){
  //   const pdfDefinition: any = {
  //     pageSize: {
  //       width: 794,
  //       height: 1123,
  //     },
  //     pageMargins: [ 30, 30, 30, 30 ],
  //     content: [
  //       {
  //         toc: {
  //           title: {text: 'Informe de plan de mejora', style: [ 'header' ]}
  //         }
  //       },
  //       {
  //         table: {
  //           widths: [ '*', '*', '*', '*' ],
  //           body: [
  //             [
  //               { text: '1. Información general del Prestador de Servicios Turísticos - PST', colSpan: 4, alignment: 'center', bold: true},
  //               {},
  //               {},
  //               {}
  //             ],
  //             [
  //               'Nombre del prestador de servicios turísticos PST',
  //               {text: this.nombrePst, colSpan:3, alignment: 'center'},
  //               {},
  //               {}
  //             ],
  //             [
  //               'Número de identificación tributaria NIT',
  //               this.nit,
  //               'Registro Nacional de Turismo RNT',
  //               this.rnt
  //             ],
  //             [
  //               'Categoría en el RNT',
  //               '',
  //               'Subcategoría en el RNT	',
  //               ''
  //             ],
  //             [
  //               'Municipio',
  //               '',
  //               'Departamento',
  //               ''
  //             ],
  //             [
  //               'NTC de Turismo',
  //               this.idn,
  //               'Etapa del diagnóstico',
  //               ''
  //             ],
  //             [
  //               'Nombre del responsable de sostenibilidad',
  //               this.nombreResponsableSostenibilidad,
  //               'Teléfono de contacto del responsable de sostenibilidad',
  //               this.telefonoResponsableSostenibilidad
  //             ],
  //             [
  //               'Correo del responsable de sostenibilidad',
  //               {text: this.correoResponsableSostenibilidad, colSpan:2, alignment: 'center'},
  //               {},
  //               ''
  //             ]
  //           ]
  //         },
  //         fontSize: 10,
  //       },
  //       '\n',
  //       {
  //         table: {
  //           widths: [ '*', '*', '*' ],
  //           body: [
  //             [
  //               { text: '2. Metodología de calificación diagnóstico', alignment: 'center', bold: true, colSpan: 2},
  //               {}
  //             ],
  //             [
  //               {
  //                 text: 'Califique, acorde con la siguiente escala:\n\nC = Cumple: Se encuentra documentado, implementado, socializado y es adecuado para la organización.\nCP = Cumple parcialmente: Se encuentra parcialmente documentado o en su totalidad pero no está implementado o está en proceso de implementación o se ejecutan actividades pero no están documentadas.\nNC = No cumple: No se ha realizado ninguna acción respecto al requisito.\nNA = No aplica: No es aplicable el requisito a la organización.',
  //                 colSpan: 2
  //               },
  //               {}
  //             ]
  //           ]
  //         }
  //       },
  //       '\n',
  //       {
  //         table: {
  //           widths: [ 80, 85, 'auto', 'auto','auto', 'auto' ],
  //           body: [
  //             [
  //               {text: 'Numeral', style: ['tituloDinamico']},
  //               {text: 'Titulo del requisito', style: ['tituloDinamico']},
  //               {text: 'Posible evidencia', style: ['tituloDinamico']},
  //               {text: 'Estado', style: ['tituloDinamico']},
  //               {text: 'Actividad general o fase a realizar', style: ['tituloDinamico']},
  //               {text: 'Duración', style: ['tituloDinamico']},
  //             ],
  //             // Aquí va el título NUMERAL
  //             ...this.datos.calificacion.map((item: any) => [
  //               {text: item.numeral, style: [ 'dinamicTable' ]},
  //               {text: item.tituloRequisito, style: [ 'dinamicTable' ]},
  //               {text: item.evidencia, fontSize: 10},
  //               {text: item.calificado, fontSize: 10},
  //               {text: item.observacion, style: [ 'dinamicTable' ]},
  //               {text: item.duracion, style: [ 'dinamicTable' ]}
  //             ]),
  //           ]
  //         }
  //       }
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 16,
  //         bold: true,
  //         margin: [0, 10, 0, 10],
  //         alignment: 'center',
  //       },
  //       planMejora: {
  //         alignment: 'center', 
  //         bold: true, 
  //         fontSize: 10
  //       },
  //       tituloDinamico: {
  //         alignment: 'center', 
  //         bold: true,
  //         fontSize: 10,
  //       },
  //       dinamicTable: {
  //         fontSize: 10,
  //         alignment: 'center'
  //       }
  //     }
  //   }
  //   pdfMake.createPdf(pdfDefinition).download('Informe_de_plan_de_mejora.pdf');
  // }