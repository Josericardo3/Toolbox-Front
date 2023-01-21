import { createReducer, on } from '@ngrx/store'
// M import { increment, decrement, reset } from '../action/example.action';
import { saveDataLogin } from '../action/example.action'

export const initialState = {
  dataLogin: '',
}

const _stateReducer = createReducer(
  initialState,
  on(saveDataLogin, (state, request) => {
    //console.log(state,"state1")
    return {
      ...state,
      dataLogin: request.request,
    }
  }),
  //desencriptar on(increment, (state) => {
  //   console.log(state,"state1")
  //   return state + 1
  // } ),

  // on(decrement, (state) => state - 1),
  // on(reset, (state) => 0)
)

//guarda estado global
export function stateReducer(state: any, action: any) {
  //M console.log(state,action,"estado")
  return _stateReducer(state, action)
}
