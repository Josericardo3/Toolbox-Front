import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  chartImage: string;

  constructor() { }

  captureChart() {
    html2canvas(document.getElementById("chart-container")).then(canvas => {
      this.chartImage = canvas.toDataURL();
    });
  } 
}
