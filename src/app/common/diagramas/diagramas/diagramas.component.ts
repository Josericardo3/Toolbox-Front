import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, Input, ChangeDetectorRef, AfterContentChecked  } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import 'chartjs-plugin-datalabels';
import{Chart,registerables} from 'node_modules/chart.js'

@Component({
  selector: 'app-diagramas',
  templateUrl: './diagramas.component.html',
  styleUrls: ['./diagramas.component.css']
})
export class DiagramasComponent implements OnInit, AfterContentChecked {

  @Input() labels: string[];
  @Input() porcentajes: number[];
  @Input() id: number;
  @Input() tipo: any;
  @Input() orientacion: any;

  datos: any[];
  chartRadio: any;
  chartDesplegable: any;

  constructor(
    public ApiService: ApiService,
    private cd: ChangeDetectorRef,
  ) { }

  ngAfterContentChecked(): void {
    this.cd.detectChanges();
  }

  // ngOnChanges(){
  //   // setTimeout(() => {
  //   //   this.diagramas()
  //   //   console.log(this.id)
  //   // }, 1000);
  // }

  ngOnInit() { 
    setTimeout(() => {
      this.diagramas()
    }, 3000);
  }

  // ngAfterViewInit() {
  //   // setTimeout(() => {
  //     // this.diagramas();
  //   // }, 3000); 
  // }

  diagramas(): void {  
    if (!this.labels || !this.porcentajes || this.labels.length !== this.porcentajes.length) {
      return;
    }

    // Genera una paleta de colores dinámicamente
    const palette = this.generateColorPalette(this.labels.length);
  
    // Ajusta el tamaño del contenedor del gráfico (puedes cambiar estos valores según tus necesidades)
    // const chartContainer = document.getElementById('myChart') as HTMLCanvasElement;
    // if (chartContainer) {
    //   chartContainer.style.width = '300px';
    //   chartContainer.style.height = '300px';
    // }
  console.log(this.id, 'this.id')
  
    // Crea el gráfico de pie con porcentajes encima de cada segmento
    this.chartRadio = new Chart(`myChart_${this.id}`, {
      type: this.tipo,
      data: {
        labels: this.labels,
        datasets: [{
          label: 'RESULTADO %',
          data: this.porcentajes,
          backgroundColor: palette,
          borderColor: palette,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: this.orientacion,
        elements: {
          bar: {
            borderWidth: 2,
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  generateColorPalette(count: number): string[] {
    // return ['#068460', '#FF5733', '#3366FF', '#FFCC00', '#9933FF', '#00CC66', '#FF6666', '#66CCCC', '#FF9933', '#CC66CC'].slice(0, count);

    const palette = [];

    for (let i = 0; i < count; i++) {
      palette.push(this.generateRandomColor());
    }
  
    return palette;
  }

  generateRandomColor(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
  
    return `rgb(${red}, ${green}, ${blue})`;
  }

  // generateColorPalette(count: number): string[] {
  //   // Colores base
  //   const baseColors = ['#068460', '#FF5733', '#3366FF', '#FFCC00', '#9933FF', '#00CC66', '#FF6666', '#66CCCC', '#FF9933', '#CC66CC'];
  
  //   // Ajustar la luminosidad de los colores base usando tinycolor
  //   const adjustedColors = baseColors.map(color => tinycolor(color).lighten(10).toString());
  
  //   // Devolver los colores ajustados según la cantidad requerida
  //   return adjustedColors.slice(0, count);
  // }

}
