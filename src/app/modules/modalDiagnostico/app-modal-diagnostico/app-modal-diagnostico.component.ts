import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-modal-diagnostico',
  templateUrl: './app-modal-diagnostico.component.html',
  styleUrls: ['./app-modal-diagnostico.component.css']
})
export class AppModalDiagnosticoComponent implements OnInit{

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void { }

  linkToDashboard(evt: any){
    this.router.navigate(['/diagnosticoDoc']); 
  }

}
