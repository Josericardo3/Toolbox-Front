import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.css']
})
export class TablasComponent implements OnInit{

  @Input() datosTabla: any[] = [];
  @Input() columnas: string[] = [];

  constructor() { }

  ngOnInit() { }

}
