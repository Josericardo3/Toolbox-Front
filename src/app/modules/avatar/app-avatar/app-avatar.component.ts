import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { Component, AfterViewInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service'
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';


declare var $: any;

@Component({

  selector: 'app-app-avatar',
  templateUrl: './app-avatar.component.html',
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false, showIndicators: true } }
  ],
  styleUrls: ['./app-avatar.component.css']
})
export class AppAvatarComponent {

  constructor(
    private modalService: BsModalService,
    public ApiService: ApiService,
    private Message: ModalService
  ) { }

  // Métodos para abrir y cerrar el modal
  modalRef: BsModalRef;
  id!: number;
  objUser: any ={};

  ngOnInit() {}

  openModal(template: any) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
   this.modalRef.hide();
  }

  ngAfterViewInit() {
    $(

      document).ready(function () {
        $(

          '.carousel').carousel();
      });
  }
  
  avatarSave() {
    // Obtiene la imagen actualmente activa en el carrusel
    const currentImage = document.querySelector("#myCarousel .carousel-inner .item.active img");
    // Obtiene el valor de data-value de la imagen actual
    const currentImageValue = currentImage.getAttribute("data-value");
    // Guarda el valor de la imagen actual en alguna variable o envíalo al servidor
    console.log("Imagen actual: " + currentImageValue);
    const idTipoAvatar =  Number(currentImageValue);

    this.ApiService.putAvatar(idTipoAvatar).subscribe((data: any) => {
      debugger;
      console.log('data ' + data.valor)
      const title = "Registro exitoso";
      const message = "El registro se ha realizado exitosamente"
      this.Message.showModal(title, message);
      this.closeModal()
     
    })
  }
}

