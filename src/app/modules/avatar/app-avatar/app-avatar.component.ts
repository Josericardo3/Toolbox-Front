import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { Component, AfterViewInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api/api.service'
import { ModalService } from 'src/app/messagemodal/messagemodal.component.service';
import { Router } from '@angular/router';

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
    private Message: ModalService,
    private router: Router
  ) { }


  modalRef: BsModalRef;
  id!: number;
  objUser: any ={};

  ngOnInit() {
    this.getUser(); 
  }

  openModal(template: any) {
    this.modalRef = this.modalService.show(template);
  }

  reloadModule() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }


 ngAfterViewInit() {

  $(document).ready(() => {
    const userAvatarValue = this.userAvatar?.toString(); // Obtener el valor de userAvatar como cadena de texto
    const carousel = $('.carousel');

    if (userAvatarValue) {
      const carouselItems = carousel.find('.item');
      const userAvatarItem = carouselItems.filter(`[data-value="${userAvatarValue}"]`);

      // Agregar la clase "active" al userAvatarItem para mostrarlo como seleccionado
      userAvatarItem.addClass('active');
    }
    carousel.carousel();
  });
}

  
  avatarSave() {
    // Obtiene la imagen actualmente activa en el carrusel
    const currentImage = document.querySelector("#myCarousel .carousel-inner .item.active img");
    // Obtiene el valor de data-value de la imagen actual
    const currentImageValue = currentImage.getAttribute("data-value");
    // Guarda el valor de la imagen actual en alguna variable o envíalo al servidor
    const idTipoAvatar =  Number(currentImageValue);

    this.ApiService.putAvatar(idTipoAvatar).subscribe((data: any) => {
      const title = "Registro exitoso";
      const message = "El registro se ha realizado exitosamente"
      this.Message.showModal(title, message);
      this.closeModal()
    })
  }

  userAvatar: any = {};
  userAvatarValue: string;
  getUser() {
    const idUsuario = window.localStorage.getItem('Id');
    this.ApiService.getUserAvatar(idUsuario).subscribe((data: any) => {
      this.userAvatar = data.FK_ID_TIPO_AVATAR;
      this.userAvatarValue = this.userAvatar.toString();

    })
  }
  
}

