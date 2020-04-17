import { Injectable } from '@angular/core';
import {Figure} from './figure';
import {Point} from './point';

export class Planet extends Figure {


  draw(ctx: CanvasRenderingContext2D, point0: Point) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'yellow';
    ctx.arc(350  + point0.x, 100  + point0.y, 75,  0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
}
