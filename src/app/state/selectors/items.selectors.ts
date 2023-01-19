import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface FeatureState {
  dataLogin : any;
}

export const selectFeature = (state: any) => state;

export const selectFeatureCount = createFeatureSelector<any>(
  'dataLogin'
  
);

export const getErrorMessage = createSelector(selectFeature,(state) => {
  return state.errorMesagge;
})