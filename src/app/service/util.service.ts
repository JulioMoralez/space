import { Injectable } from '@angular/core';
import {Point} from './point';


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

  static getRandomPointOverMap(maxMapX: number, maxMapY: number): Point {
    switch (UtilService.getRandomInteger(0, 3)) {
      case 0: {
        return new Point(-200, UtilService.getRandomInteger(0, maxMapY));
      }
      case 1: {
        return new Point(maxMapX + 200, UtilService.getRandomInteger(0, maxMapY));
      }
      case 2: {
        return new Point(UtilService.getRandomInteger(0, maxMapX), -200);
      }
      case 3: {
        return new Point(UtilService.getRandomInteger(0, maxMapX), maxMapY + 200);
      }
    }
  }
}
