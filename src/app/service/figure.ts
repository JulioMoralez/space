import {Point} from './point';
import {Line} from './line';

export class Figure {
  private _points: Point[] = [];
  private _lines: Line[] = [];
  private _point0: Point;
  private _radius = 50;
  private _angle = 0;
  private _currentSpeed = 0;
  private _maxSpeed = 5;
  private acc = 0.2;
  private _rot = 5;
  private PI_180 = Math.PI / 180;
  private axisF: Point = null; // передняя точка оси
  private axisR: Point = null; // задняя точка оси
  private _chekpoints: Point[] = []; // контрольные точки маршрута
  private _target: Figure = null; // выбранная цель
  private follow = false; // режим следования за целью
  private followRadius = 3; // расстояние приближения к цели при следовании в  радиусах цели
  private hToTargetOld = 0; // расстояние до цели при следовании на прошлом цикле


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

  get currentSpeed(): number {
    return this._currentSpeed;
  }

  set currentSpeed(value: number) {
    this._currentSpeed = value;
  }

  get rot(): number {
    return this._rot;
  }

  set rot(value: number) {
    this._rot = value;
  }

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    this._radius = value;
  }


  get target(): Figure {
    return this._target;
  }

  set target(value: Figure) {
    this._target = value;
  }

  get chekpoints(): Point[] {
    return this._chekpoints;
  }

  set chekpoints(value: Point[]) {
    this._chekpoints = value;
  }

  draw(ctx: CanvasRenderingContext2D, point0: Point) {
    // рисуем объект из линий
    this._lines.forEach(line => {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.moveTo(this._points[line.p1].x + point0.x, this._points[line.p1].y + point0.y);
      ctx.lineTo(this._points[line.p2].x + point0.x, this._points[line.p2].y + point0.y);
      ctx.stroke();
    });
    // рисуем маршрут
    this._chekpoints.forEach(chekpoint => {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'blue';
        ctx.arc(chekpoint.x  + point0.x, chekpoint.y  + point0.y, 20,  0, 2 * Math.PI);
        ctx.stroke();
    });
    // отмечаем выбранный объект
    if (this._target !== null) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'green';
      ctx.arc(this._target.point0.x  + point0.x, this._target.point0.y  + point0.y, this._target._radius + 10,  0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  forward(df: number) {
    if (df === 0) {
      return;
    }
    const a = Math.atan2(this.axisF.y - this.axisR.y, this.axisF.x - this.axisR.x);
    this._point0.x += df * Math.cos(a);
    this._point0.y += df * Math.sin(a);
    this._points.forEach(point => {
      point.x += df * Math.cos(a);
      point.y += df * Math.sin(a);
    });
  }

  setAxis(axisF: Point, axisR: Point) {
    this.axisF = axisF;
    this.axisR = axisR;
  }

  povorot(rot: number) {
    rot *= this.PI_180;
    this._points.forEach(point => {
      point.povorot(rot, this._point0.x, this._point0.y);
    });
  }

  calcAngle(p1: Point, p2: Point): number {
    if (p1.x === p2.x) {  // при равенстве X сразу дадим результат
      return (p1.y - p2.y) < 0 ? 90 : 270;
    }
    // считаем угол вектора относительно ОХ, учитвая направление ветора p1p2
    let angle = Math.atan((p1.y - p2.y) / (p1.x - p2.x));
    if ((p1.x - p2.x) > 0) {
      angle = -angle;
    } else {
      if ((p1.y - p2.y) > 0) {
        angle = - Math.PI - angle;
      } else {
        angle = Math.PI - angle;
      }
    }
    const t =  angle * 180 / Math.PI;
    return t >= 0 ? Math.abs(t) : 360 + t;
  }

  moveToCheckpoint() {
    if (this._chekpoints.length > 0) {
      const h = Math.sqrt((this._chekpoints[0].x - this._point0.x) * (this._chekpoints[0].x - this._point0.x) +
                              (this._chekpoints[0].y - this._point0.y) * (this._chekpoints[0].y - this._point0.y));
      const radiusCheckpointOrTarget = (this.target !== null) ? this.target._radius : 50; // размер зоны достижения цели
      if ((h < radiusCheckpointOrTarget) && (!this.follow)) {
        this._chekpoints.shift(); // удаляем текущую точку, если достигли цели и не в режиме следования за целью
      } else {
        const dt = this.calcAngle(this._chekpoints[0], this._point0);
        const d = this.calcAngle(this.axisF, this.axisR);
        let rot = 0 ;
        // зная два вектора (ось объекта и вектор к цели) поворачиваем в ближайшую сторону
        const diffAngle = Math.abs(d - dt);
        if (diffAngle > 10) { // если разница больше, то поворачиваем
          if (diffAngle > 180)  { // определяем напраление поворота
            rot = d < dt ? this._rot : -this._rot;
          } else {
            rot = d < dt ? -this._rot : this._rot;
          }
        }
        this.povorot(rot);
        if (this.currentSpeed < this._maxSpeed) { // набор скорости
          this.currentSpeed += this.acc;
        }
      }
      if (this.follow) { // регулируем скорость при следовании за целью
        if (h < (this.target._radius * this.followRadius)) { // при приближении к цели ближе указанного
          if (h < this.hToTargetOld) {
            // замедляемся на 2x ускорения (ускорение на 1x выше по коду на этом же цикле), что даёт замедление на 1x
            this.currentSpeed -= 2 * this.acc;
          }
        }
        this.hToTargetOld = h;
      }
    } else { // если не осталось целей для передвижения
      if (this.currentSpeed > 0) {  // и имеем скорость, то тормозим
        this.currentSpeed -= this.acc;
        if (this.currentSpeed < 0)  {
          this.currentSpeed = 0;   // до полной остановки
        }
      }
    }
    this.forward(this.currentSpeed);
  }

  checkOnArea(point: Point): boolean {
    const dx = point.x - this._point0.x;
    const dy = point.y - this._point0.y;
    return (Math.sqrt(dx * dx + dy * dy) < this._radius);
  }

  moveOnEllipse(){
  }

  setParent(parentFigure: Figure, orbitX: number, orbitY: number, orbitSpeed: number, u: number) {
  }

  moveToTarget() {
    if (this._target !== null) {
      this._chekpoints.length = 0;
      this._chekpoints.push(this._target.point0);
      this.follow = false;
    }
  }

  followToTarget() {
    if (this._target !== null) {
      this._chekpoints.length = 0;
      this._chekpoints.push(this._target.point0);
      this.follow = true;
    }
  }

  resetTarget() {
    this._chekpoints.length = 0;
    this.follow = false;
    this._target = null;
  }
}
