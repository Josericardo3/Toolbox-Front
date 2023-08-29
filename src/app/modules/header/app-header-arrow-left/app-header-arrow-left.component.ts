import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-app-header-arrow-left',
  templateUrl: './app-header-arrow-left.component.html',
  styleUrls: ['./app-header-arrow-left.component.css']
})
export class AppHeaderArrowLeftComponent {

  constructor(private location: Location) { }

  retroceder() {
    this.location.back();
  }

}
