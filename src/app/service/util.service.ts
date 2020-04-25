import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  static randi = 1;

  constructor() {
  }

  static getRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  static rand(i: number, m: number): number {
    return this.randi = Math.abs(Math.ceil(Math.sin(i) * m));
  }

  static ggg() {
    for (let i = 0; i < 10; i++) {
      console.log(this.rand(this.randi + i, 10));
    }
  }
}
