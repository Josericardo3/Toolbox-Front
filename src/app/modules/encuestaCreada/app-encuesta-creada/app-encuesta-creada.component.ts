import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-app-encuesta-creada',
  templateUrl: './app-encuesta-creada.component.html',
  styleUrls: ['./app-encuesta-creada.component.css']
})
export class AppEncuestaCreadaComponent implements OnInit{
  encuestaId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.encuestaId = params['id']
    });
  }

}
