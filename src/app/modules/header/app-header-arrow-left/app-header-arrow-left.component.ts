import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-header-arrow-left',
  templateUrl: './app-header-arrow-left.component.html',
  styleUrls: ['./app-header-arrow-left.component.css']
})
export class AppHeaderArrowLeftComponent implements OnInit{
  @Input() redirectToDashboard: boolean = false;
  @Input() redirectToDiagEtapas: boolean = false;

  constructor(
    private location: Location,
    public router: Router
    ){}

  ngOnInit(): void {}

  retroceder() {
    if (this.redirectToDashboard) {
      this.router.navigate(['/dashboard']);
    } else if (this.redirectToDiagEtapas) {
      this.router.navigate(['/diagnosticoEtapas']);
    } else{
      this.location.back();
    }
  }

}
