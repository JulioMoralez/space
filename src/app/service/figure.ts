import {Point} from './point';
import {Line} from './line';

export class Figure {
  private _points: Point[] = [];
  private _lines: Line[] = [];
  private _point0: Point;
  private _angle = 0;
  private _speed = 0;
  private _rot = 1;
  private PI_180 = Math.PI / 180;
  private axisF: Point = null; // передняя точка оси
  private axisR: Point = null; // задняя точка оси
   target: Point = null;


  constructor(point0: Point) {
    this._point0 = point0;
  }

  get lines(): Line[] {
    return this._lines;
  }

  set lines(value: Line[]) {
    this._lines = value;
  }

  get point0(): Point {
    return this._point0;
  }

  set point0(value: Point) {
    this._point0 = value;
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
    const a = Math.atan2(this.axisF.y - this.axisR.y, this.axisF.x - this.axisR.x);
    this._point0.x += df * Math.cos(a);
    this._point0.y += df * Math.sin(a);
    for (let i = 0; i < this._points.length; i++) {
      this._points[i].x += df * Math.cos(a);
      this._points[i].y += df * Math.sin(a);
    }
  }

  setAxis(axisF: Point, axisR: Point) {
    this.axisF = axisF;
    this.axisR = axisR;
  }

  povorot(rot: number) {
    rot *= this.PI_180;
    for (let i = 0; i < this._points.length; i++) {
      this._points[i].povorot(rot, this._point0.x, this._point0.y);
    }
  }

  calcAngle(p1: Point, p2: Point): number {
    let angle = (p1.x - p2.x) !== 0 ? Math.atan((p1.y - p2.y) / (p1.x - p2.x)) : Math.PI / 2;
    if ((p1.x - p2.x) > 0) {
      angle = -angle;
    } else {
      if ((p1.y - p2.y) > 0) {
        angle = - Math.PI - angle;
      } else {
        angle = Math.PI - angle;
      }
    }
    return angle * 180 / Math.PI;
  }

  moveToTarget() {
    const dt = this.calcAngle(this.target, this._point0);
    const d = this.calcAngle(this.axisF, this.axisR);
 //   if (((dt - d) < -0.1) || ((dt - d) > 0.1)) {

 //   }
    if (((d - dt) > 0) || ((d - dt) < -180)) {
      this.povorot(1);
    } else {
      this.povorot(-1);
    }

  //  console.log(dt * 180 / Math.PI, d * 180 / Math.PI);
  }

  moveOnEllipse(){
  }

  setParent(parentFigure: Figure, orbitX: number, orbitY: number, orbitSpeed: number, u: number) {
  }
}
