import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getRandomInteger(min, max) {
    return Math.floor( min + Math.random() * (max + 1 - min));
  }
}
