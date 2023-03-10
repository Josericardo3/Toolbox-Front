import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class ModalService {
  private modalSubject = new BehaviorSubject<{
    showModal: boolean;
    title: string;
    message: string;
  }>({
    showModal: false,
    title: "",
    message: "",
  });
  public modal$ = this.modalSubject.asObservable();
  constructor() {}
  showModal(title: string, message: string): void {
    this.modalSubject.next({
      showModal: true,
      title,
      message,
    });
  }
  hideModal(): void {
    this.modalSubject.next({
      showModal: false,
      title: "",
      message: "",
    });
  }
}
