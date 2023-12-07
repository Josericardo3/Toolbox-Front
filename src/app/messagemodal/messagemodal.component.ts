import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalService } from "src/app/messagemodal/messagemodal.component.service";

@Component({
  selector: "app-modal",
  templateUrl: "./messagemodal.component.html",
  styleUrls: ["./messagemodal.component.css"],
})
export class ModalComponent implements OnInit {

  public showModal: boolean;
  public title: string;
  public message: string;
  // public redirectUrl: string;

  constructor(private modalService: ModalService, private router: Router) {}

  ngOnInit(): void {
    this.modalService.modal$.subscribe((modalData) => {
      this.showModal = modalData.showModal;
      this.title = modalData.title;
      this.message = modalData.message;
      // this.redirectUrl = modalData.redirectUrl;
    });

    // this.modalService.closeModal$.subscribe((modalData) => {
    //   // this.handleCloseModal();
    //   this.redirectUrl = modalData.redirectUrl;
    // });
  }

  closeModal(): void {
    this.modalService.hideModal();
    // if (this.redirectUrl) {
    //   console.log('Redirecting to:', this.redirectUrl);
    //   this.router.navigate([this.redirectUrl]);
    // }
  }

  // private handleCloseModal(): void {
  //   console.log('Modal is being closed');
  //   if (this.redirectUrl) {
  //     console.log('Redirecting to:', this.redirectUrl);
  //     this.router.navigate([this.redirectUrl]);
  //   }
  // }  

}
