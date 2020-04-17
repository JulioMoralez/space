import {Point} from './point';
import {Line} from './line';

export class Figure {
  private _points: Point[] = [];
  private _lines: Line[] = [];
  private _x0 = 0;
  private _y0 = 0;
  private _angle = 0;
  private _speed = 0;
  private _rot = 0;
  private PI_180 = Math.PI / 180;

  get lines(): Line[] {
    return this._lines;
  }

  set lines(value: Line[]) {
    this._lines = value;
  }

  get x0(): number {
    return this._x0;
  }

  set x0(value: number) {
    this._x0 = value;
  }

  get y0(): number {
    return this._y0;
  }

  set y0(value: number) {
    this._y0 = value;
  }

  get points(): Point[] {
    return this._points;
  }

  set points(value: Point[]) {
    this._points = value;
  }

  get angle(): number {
    return this._angle;
  }

  set angle(value: number) {
    this._angle = value;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(value: number) {
    this._speed = value;
  }

  get rot(): number {
    return this._rot;
  }

  set rot(value: number) {
    this._rot = value;
  }

  draw(ctx: CanvasRenderingContext2D, point0: Point) {
    for (let j = 0; j < this._lines.length; j++) {
      ctx.beginPath();
      ctx.strokeStyle = this._lines[j].color;
      ctx.lineWidth = this._lines[j].width;
      ctx.moveTo(this._points[this._lines[j].p1].x + point0.x, this._points[this._lines[j].p1].y + point0.y);
      ctx.lineTo(this._points[this._lines[j].p2].x + point0.x, this._points[this._lines[j].p2].y + point0.y);
      ctx.stroke();
    }
  }

  forward(df: number) {
    const a = Math.atan2(this._points[0].y - this._points[2].y, this._points[0].x - this._points[2].x);
    this._x0 += df * Math.cos(a);
    this._y0 += df * Math.sin(a);
    for (let i = 0; i < this._points.length; i++) {
      this._points[i].x += df * Math.cos(a);
      this._points[i].y += df * Math.sin(a);
    }
  }

  povorot(rot: number) {
    rot *= this.PI_180;
    for (let i = 0; i < this._points.length; i++) {
      this._points[i].povorot(rot, this._x0, this._y0);
    }
  }
}
