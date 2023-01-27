import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  Logo(){
    const url = 'https://www.gov.co/home'
    window.location.href=url;
   }
}
