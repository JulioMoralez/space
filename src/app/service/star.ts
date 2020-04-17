import {Point} from './point';

export class Star extends Point{
  private _dy?: number;

  constructor(x: number, y: number, i: number) {
    super(x, y);
    if ((i % 2) !== 0) {
      this._dy = 1;
    } else {
      if ((i % 10) !== 0) {
        this._dy = 2;
      } else {
        this._dy = 5;
      }
    }
  }

  get dy(): number {
    return this._dy;
  }

  set dy(value: number) {
    this._dy = value;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.x, this.y, 2 , 2);
  }
}

