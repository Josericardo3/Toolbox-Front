import { Component } from '@angular/core';
import { Observable } from 'rxjs';
//import { increment, decrement, reset } from '../../state/action/example.action';
import { Store } from '@ngrx/store';
 
@Component({
  selector: 'app-my-example',
  templateUrl: './example.html',
})
export class AppMyExampleComponent {
    count$: Observable<number>;
 
    constructor(private store: Store<{ count: number }>) {
      this.count$ = store.select('count');

    }
   
    // increment() {
    //   this.store.dispatch(increment());
    // }
   
    // decrement() {
    //   this.store.dispatch(decrement());
    // }
   
    // reset() {
    //   this.store.dispatch(reset());
    // }
  }