import { Component, OnInit } from "@angular/core";
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
  constructor(private modalService: ModalService) {}
  ngOnInit(): void {
    this.modalService.modal$.subscribe((modalData) => {
      this.showModal = modalData.showModal;
      this.title = modalData.title;
      this.message = modalData.message;
    });
  }
  closeModal(): void {
    this.modalService.hideModal();
  }
}
