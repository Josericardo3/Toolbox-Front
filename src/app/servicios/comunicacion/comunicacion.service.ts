import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {

  constructor() { }

  private notifyChildSource = new Subject<void>();
 
  notifyChild$ = this.notifyChildSource.asObservable();
 
  notifyChild() {
    this.notifyChildSource.next();
  }
}
