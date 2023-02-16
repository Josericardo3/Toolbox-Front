import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-modal-success',
  templateUrl: './app-modal-success.component.html',
  styleUrls: ['./app-modal-success.component.css']
})
export class AppModalSuccessComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    //localStorage.setItem("normaSelected", evt.target.id);
   
  }


  linkToDashboard(evt: any){
    this.router.navigate(['/dashboard']); 
  }

}
