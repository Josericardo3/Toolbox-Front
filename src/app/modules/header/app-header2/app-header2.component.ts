import { Component } from '@angular/core';

@Component({
  selector: 'app-app-header2',
  templateUrl: './app-header2.component.html',
  styleUrls: ['./app-header2.component.css']
})
export class AppHeader2Component {

  Logo() {
    const url = 'https://www.gov.co/home'
    window.location.href = url;
  }
}