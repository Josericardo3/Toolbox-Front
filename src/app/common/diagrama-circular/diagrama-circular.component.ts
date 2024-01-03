import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, Input  } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import 'chartjs-plugin-datalabels';
import{Chart,registerables} from 'node_modules/chart.js'

@Component({
  selector: 'app-diagrama-circular',
  templateUrl: './diagrama-circular.component.html',
  styleUrls: ['./diagrama-circular.component.css'],
})

export class DiagramaCircularComponent implements OnInit, AfterViewInit {
  @Input() labels: string[];
  @Input() porcentajes: number[];
  @Input() id: number;
  @Input() tipo: any;
  
  datos: any[];
  chartRadio: any;
  chartDesplegable: any;

  constructor(
    public ApiService: ApiService,
  ) { }

  ngOnChanges(){
    setTimeout(() => {
      this.radioButton()
      console.log(this.id)
    }, 3000);
  }

  ngOnInit() { 
    setTimeout(() => {
      this.radioButton()
      console.log(this.id)
    }, 3000);
  }

  ngAfterViewInit() {
    this.radioButton();
  }

  radioButton(): void {  
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
        indexAxis: 'y',
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
    return ['#068460', '#FF5733', '#3366FF', '#FFCC00', '#9933FF', '#00CC66', '#FF6666', '#66CCCC', '#FF9933', '#CC66CC'].slice(0, count);
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
