import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset } from '../action/example.action';

export const initialState = 0;

const _counterReducer = createReducer(
  initialState,
  on(increment, (state) => {
    console.log(state,"state1")
    return state + 1
  } ),
  
  on(decrement, (state) => state - 1),
  on(reset, (state) => 0)
);

export function counterReducer(state: any, action: any) {
  console.log(initialState,"state")
  return _counterReducer(state, action);
}