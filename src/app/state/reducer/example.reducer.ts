import { createReducer, on } from '@ngrx/store'
// M import { increment, decrement, reset } from '../action/example.action';
import { saveDataLogin } from '../action/example.action'

export const initialState = {
  dataLogin: '',
}

const _stateReducer = createReducer(
  initialState,
  on(saveDataLogin, (state, request) => {
    return {
      ...state,
      dataLogin: request.request,
    }
  }),
)

//guarda estado global
export function stateReducer(state: any, action: any) {
  return _stateReducer(state, action)
}
