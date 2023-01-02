import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {

  constructor() { }

  private _token!: string;

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }
}
