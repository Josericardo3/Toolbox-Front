import { Component, ElementRef, Inject, Input, QueryList, ViewChildren } from '@angular/core';
import { IndicadorService } from '../../../../servicios/kpis/indicador.service';
import{Chart,registerables} from 'node_modules/chart.js'
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { helpers } from 'src/app/modules/Helpers/helpers';

Chart.register(...registerables);
@Component({
  selector: 'app-grafico-indicadores-evaluacion',
  templateUrl: './grafico-indicadores-evaluacion.component.html',
  styleUrls: ['./grafico-indicadores-evaluacion.component.css']
})
export class GraficoIndicadoresEvaluacionComponent {
  @Input() ID_INDICADOR :any; 
  filterGrafico:any={ ANIO: "", ID_INDICADOR: 0,ID_PAQUETE:0};
   ctx:any = document.getElementById('myChart');
   @ViewChildren('myCanvas') canvasElements: QueryList<ElementRef>;
   char:any;
   data:any={PROCESOS_EVALUACION:[]};
   completado:boolean;
   model:any;
   procesos:any=[];
   anios:any=[];
   constructor(
    private _dialog: MatDialogRef<GraficoIndicadoresEvaluacionComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private indicadorService: IndicadorService,
    private modalService: ModalService,
    private elementRef: ElementRef,
    private helper:helpers
  ) {
    this.filterGrafico.ID_INDICADOR=datos[0].ID_INDICADOR;
    this.filterGrafico.ID_PAQUETE =datos[0].ID_PAQUETE;
     this.procesos=datos[1];
     const currentYear = new Date().getFullYear();
     this.anios=datos[2];
    }
  
   ngOnInit(): void{
    this.filterGrafico.ANIO=new Date().getFullYear().toString();
    this.filterGrafico.ID_PROCESO=0;

   this.obtener();
   
  }
obtener(){
  this.indicadorService.obtenerDataGraficoIndicador(this.filterGrafico).subscribe({
    next: (x) => {
      if (x.Confirmacion) {
        this.data = x.Data;
        setTimeout(() => {
          this.obtenerGrafico()
        }, 100);
        
      } else {
      }
    },
    error: (e) => {},
  });
  
  
}

obtenerGrafico(){
 
  if (this.char) {
    this.char.destroy(); // Destruye el gráfico anterior si existe
  }
  for (let index = 0; index < this.data.PROCESOS_EVALUACION.length; index++) {
    
    const element = this.data.PROCESOS_EVALUACION[index].EVALUACIONES;
    
    if(element.length<1){
      continue;
    }
    const periodos = element.map(item => item.PERIODO);
    const resultados = element.map(item => item.RESULTADO);
    const metas = element.map(item => item.META);
   
      this.char=new Chart(`myChart-${index}`, {
        type: 'bar',
        data: {
          labels: periodos,
          datasets: [{
            label: 'RESULTADO %',
            data: resultados,
            backgroundColor: [
              ' #068460'
              
            ],
            borderColor: [
              ' #068460'
            ],
            borderWidth: 1
          },
          {
            label: 'META %',
            data: metas,
            backgroundColor: [
              'orange'
              
            ],
            borderColor: [
              'orange'
            ],
            borderWidth: 1
          }
        ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax:100,
              ticks: {
                stepSize: 10  // Esto establece el incremento en el eje Y
              ,
              
              } 
            }
          }
        }
      }); 

      if (!this.data) {
        return; // Evitar errores si los datos aún no se han cargado
      }
  
   
  }
}
 

cerrarDialog(opcion: number) {
  this._dialog.close(opcion);
}
}
