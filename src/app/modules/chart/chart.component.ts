import { Component, OnInit } from '@angular/core';
import { ImagenService } from 'src/app/servicios/imagen.service';
// import { Chart } from 'chart.js';

// import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
// import { createCanvas, Image } from 'canvas';
// const chartJSNodeCanvas = require('chartjs-node-canvas');

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(private imagenService: ImagenService) {}

  ngOnInit(): void {}

  chart(){
    const data = {
      labels: ['C', 'CP', 'NC', 'NA'],
      datasets: [{
        data: [10, 20, 30, 40],
        backgroundColor: ['#00986c', '#2ca880', '#57bd9e', '#7ad3be'],
      }]
    };
    const canvas = <HTMLCanvasElement>document.getElementById('myChart');
    const ctx = canvas.getContext('2d');
    // const myChart = new Chart(ctx, {
    //   type: 'pie',
    //   data: data
    // });
    setTimeout(() => {
      this.imagenService.captureChart();
    }, 1000);
  }

}
