import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SpinnerService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    constructor(private spinnerService: NgxSpinnerService ) {}

    public llamarSpinner() {
        this.loadingSubject.next(true);
        this.spinnerService.show();
    }
    public detenerSpinner() {
        this.loadingSubject.next(false);
        this.spinnerService.hide();
    }
}