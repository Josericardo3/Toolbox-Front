import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-app-modal-inicial',
  templateUrl: './app-modal-inicial.component.html',
  styleUrls: ['./app-modal-inicial.component.css']
})
export class AppModalInicialComponent implements OnInit {
isOpen = true;
data= JSON.parse(localStorage.getItem('norma') || '');
  constructor(
    private router: Router,
  ) {
   }

  ngOnInit(): void {
  }

  linkToDashboard(evt:any){
    localStorage.setItem("normaSelected", evt.target.id);
    setTimeout(() => {
      this.router.navigate(['/dashboard']); 
    }, 600);
    
  }
  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
}

