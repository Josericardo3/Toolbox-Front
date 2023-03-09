import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit {
  password: string;
  confirmPassword: string;
  error: string;
  id: string;

  constructor(private http: HttpClient, private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('ID:', this.id);
    $('#passwordChangedModal').modal('hide');
  }

  resetPassword() {
    const passwordInput = document.querySelector('#password') as HTMLInputElement;
    const password = passwordInput.value;
    const confirmPasswordInput = document.querySelector('#confirm-password') as HTMLInputElement;
    const confirmPassword = confirmPasswordInput.value;
    if (password !== confirmPassword) {
      this.error = "Las contraseñas no coinciden";
      return;
    }

    this.http.post(`https://www.toolbox.somee.com/api/Usuario/CambioContraseña?password=${password}&id=${this.id}`, { id: this.id })
      .subscribe(
        (response) => {
          this.router.navigate(['/']);
          console.log(response)
          
          
        },
        (error: string) => console.log(error)
      );
  }
  onPasswordInput() {
    this.error = '';
  }
}
