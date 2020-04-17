import { Injectable } from '@angular/core';
import {Point} from './point';

export class Joy {
  clicked = false;
  pointJoy0: Point;
  pointJoy: Point;
  radiusArea = 100;
  radiusJoy = 20;
  h = 0;
  shiftX = 0;
  shiftY = 0;

  constructor(point0: Point) {
    this.pointJoy0 = point0;
    this.pointJoy = new Point(point0.x, point0.y);
  }

  shiftJoy(x: number, y: number, point0: Point) {
    const dx = x - this.pointJoy0.x;
    const dy = y - this.pointJoy0.y;
    this.h = Math.sqrt(dx * dx + dy * dy);
    const cos = dx / this.h;
    const sin = dy / this.h;
    if ( this.h > this.radiusArea ) {
      x = this.pointJoy0.x + this.radiusArea * cos;
      y = this.pointJoy0.y + this.radiusArea * sin;
      this.h = this.radiusArea;
    }
    this.pointJoy.x = x;
    this.pointJoy.y = y;

    this.shiftX = this.h / 10 * cos;
    this.shiftY = this.h / 10 * sin;
    // баг (фича) - двигаем сам джойстик
    // this.point0.x += this.shiftX;
    // this.point0.y += this.shiftY;
    point0.x -= this.shiftX;
    point0.y -= this.shiftY;
  }
}
