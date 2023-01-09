import { createAction,props} from '@ngrx/store';

export const saveDataLogin = createAction('[Login Component] saveDataLogin',props<{request:any}>());



//encriptar  export const increment = createAction('[Counter Component] Increment');
// export const decrement = createAction('[Counter Component] Decrement');
// export const reset = createAction('[Counter Component] Reset');