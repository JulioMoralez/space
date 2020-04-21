
export class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  povorot(rot: number, x0: number, y0: number) {
    const cos = Math.cos(rot);
    const sin = Math.sin(rot);
    const x = x0 + (this._x - x0) * cos - (this._y - y0) * sin;
    const y = y0 + (this._x - x0) * sin + (this._y - y0) * cos;
    this._x = x;
    this._y = y;
  }

  setValue(point: Point) {
    this.x = point.x;
    this.y = point.y;
  }
}
