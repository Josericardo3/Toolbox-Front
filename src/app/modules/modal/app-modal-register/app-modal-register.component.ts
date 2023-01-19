//prueba modal independiente
// import { Component, OnInit } from '@angular/core';
// import * as $ from 'jquery';
// import 'jquery-ui/ui/widgets/dialog.js';


// @Component({
//   selector: 'app-app-modal-register',
//   templateUrl: './app-modal-register.component.html',
//   styleUrls: ['./app-modal-register.component.css']
// })
// export class AppModalRegisterComponent implements OnInit {
//   constructor() { }

//   ngOnInit(): void {
//     ($('#modalRegister') as any).dialog({
//       modal: true,
//       width: 600,
//       height: 580,
//       close: function () {
//         ($(this) as any).remove();
//         ($(this) as any).data("ui-dialog") ? ($(this) as any).dialog("destroy") : '';
//       }
//     });
//   }


//   closeModal() {
//     const modal = document.querySelector('#modalRegister') as HTMLInputElement
//     modal.classList.remove('active')
//   }
// }
