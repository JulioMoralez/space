import {Point} from './point';
import {Line} from './line';

export enum State {
  IDLE, FOLLOW, DOCKING, DOCK, DEAD, JUMP, BORDER
}

export class Figure {
  private _points: Point[] = [];
  private _lines: Line[] = [];
  private _point0: Point;
  private _radius = 50;
  private _angle = 0;
  private _currentSpeed = 0;
  private _maxSpeed = 1;
  private _accSpeed = 0.1;
  private _rot = 5;
  private PI_180 = Math.PI / 180;
  private _axisF: Point = null; // передняя точка оси
  private _axisR: Point = null; // задняя точка оси
  private _chekpoints: Point[] = []; // контрольные точки маршрута
  private _target: Figure = null; // выбранная цель
  private _state: State = State.IDLE;
  private _oldState: State = State.IDLE;
  private followRadius = 5; // расстояние приближения к цели при следовании в  радиусах цели
  private hToTargetOld = 0; // расстояние до цели при следовании на прошлом цикле
  private _onDock: Figure = null; // объект, к которому пристыкованы
  private _dockingTarget: Figure = null; // объект, к которому стыкуемся
  private _pointBeforeDock = new Point(0, 0);
  private _scale = 1; // масштаб объекта
  private _maxHp = 4;
  private _currentHp = this._maxHp;
  private _maxShield = 0;
  private _currentShield = this._maxShield;
  private minTargetWidth = 5;
  private maxTargetWidth = 10;
  private currentTargetWidth = this.minTargetWidth;
  private deltaTargetWidth = 0.5;
  private currentTargetRot = 1;
  private maxTargetRot = 10;
  private _figures: Figure[] = [];
  private _name = '';


  get oldState(): State {
    return this._oldState;
  }

  set oldState(value: State) {
    this._oldState = value;
  }

  get dockingTarget(): Figure {
    return this._dockingTarget;
  }

  set dockingTarget(value: Figure) {
    this._dockingTarget = value;
  }

  get onDock(): Figure {
    return this._onDock;
  }

  set onDock(value: Figure) {
    this._onDock = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get accSpeed(): number {
    return this._accSpeed;
  }

  set accSpeed(value: number) {
    this._accSpeed = value;
  }

  get maxShield(): number {
    return this._maxShield;
  }

  set maxShield(value: number) {
    this._maxShield = value;
  }

  get currentShield(): number {
    return this._currentShield;
  }

  set currentShield(value: number) {
    this._currentShield = value;
  }

  get maxHp(): number {
    return this._maxHp;
  }

  set maxHp(value: number) {
    this._maxHp = value;
  }

  get currentHp(): number {
    return this._currentHp;
  }

  set currentHp(value: number) {
    this._currentHp = value;
  }

  get figures(): Figure[] {
    return this._figures;
  }

  set figures(value: Figure[]) {
    this._figures = value;
  }

  get scale(): number {
    return this._scale;
  }

  set scale(value: number) {
    this._scale = value;
  }

  get maxSpeed(): number {
    return this._maxSpeed;
  }

  set maxSpeed(value: number) {
    this._maxSpeed = value;
  }

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

  get pointBeforeDock(): Point {
    return this._pointBeforeDock;
  }

  set pointBeforeDock(value: Point) {
    this._pointBeforeDock = value;
  }

  get state(): State {
    return this._state;
  }

  set state(value: State) {
    this._state = value;
  }


  get axisF(): Point {
    return this._axisF;
  }

  set axisF(value: Point) {
    this._axisF = value;
  }

  get axisR(): Point {
    return this._axisR;
  }

  set axisR(value: Point) {
    this._axisR = value;
  }

  draw(ctx: CanvasRenderingContext2D, point0: Point) {
    if (this._onDock === null) { // если не пpиcтыкoвaны, то рисуем объект
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
      if (this._target !== null) { // остваить отображение цели только для игрока playerShip === true
        ctx.beginPath();
        ctx.lineWidth = this.currentTargetWidth;
        ctx.strokeStyle = '#0F0';
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(this._target.point0.x  + point0.x, this._target.point0.y  + point0.y, this._target._radius + 10,
            Math.PI * i / 2 + this.currentTargetRot,   Math.PI * i / 2  + Math.PI / 4  + this.currentTargetRot);
          ctx.stroke();
        }
        if ((this.currentTargetWidth > this.maxTargetWidth) || (this.currentTargetWidth < this.minTargetWidth)){
          this.deltaTargetWidth = -this.deltaTargetWidth;
        }
        this.currentTargetWidth += this.deltaTargetWidth;
        this.currentTargetRot += 0.1;
        if (this.currentTargetRot > 2 * Math.PI) {
          this.currentTargetRot -= 2 * Math.PI;
        }
      }
      // хп
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.fillStyle = '#F00';
      ctx.strokeStyle = '#DDD';
      ctx.rect(this.point0.x - this.radius + point0.x, this.point0.y - this.radius * 1.7   + point0.y,
        2 * this.radius * this.currentHp / this.maxHp, 5);
      ctx.stroke();
      ctx.fill();
      // щит
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.fillStyle = '#00F';
      ctx.strokeStyle = '#DDD';
      ctx.rect(this.point0.x - this.radius + point0.x, this.point0.y - this.radius * 1.7 - 6   + point0.y,
        2 * this.radius * this.currentShield / this.maxShield, 5);
      ctx.stroke();
      ctx.fill();
    } else {
      // объект к которому пристыкованы
      ctx.beginPath();
      ctx.lineWidth = this.currentTargetWidth;
      ctx.strokeStyle = '#F00';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(this._onDock.point0.x  + point0.x, this._onDock.point0.y  + point0.y, this._onDock._radius + 10,
          Math.PI * i / 2 + this.currentTargetRot,   Math.PI * i / 2  + Math.PI / 4  + this.currentTargetRot);
        ctx.stroke();
      }
      if ((this.currentTargetWidth > this.maxTargetWidth) || (this.currentTargetWidth < this.minTargetWidth)){
        this.deltaTargetWidth = -this.deltaTargetWidth;
      }
      this.currentTargetWidth += this.deltaTargetWidth;
      this.currentTargetRot += 0.1;
      if (this.currentTargetRot > 2 * Math.PI) {
        this.currentTargetRot -= 2 * Math.PI;
      }
    }
  }



  forward(df: number) {
    if (df === 0) {
      return;
    }
    const a = Math.atan2(this._axisF.y - this._axisR.y, this._axisF.x - this._axisR.x);
    this._point0.x += df * Math.cos(a);
    this._point0.y += df * Math.sin(a);
    this._points.forEach(point => {
      point.x += df * Math.cos(a);
      point.y += df * Math.sin(a);
    });
  }

  setAxis(axisF: Point, axisR: Point) {
    this._axisF = axisF;
    this._axisR = axisR;
  }

  povorot(rot: number) {
    this._angle += rot;
    rot *= this.PI_180;
    if (this._angle >= 360) {
      this._angle -= 360;
    }
    if (this._angle <= -360) {
      this._angle += 360;
    }
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

  moveToCheckpoint(maxMapX: number, maxMapY: number) {
    if (this._state !== State.DOCK) { // если не пристыкованы, то двигаемся к цели
      let rot = 0 ;
      if (this._chekpoints.length > 0) {
        if ((this.state !== State.BORDER) && // если достигаем границы карты, то разворачиваемся
          ((this.point0.x < 0) || (this.point0.x > maxMapX) || (this.point0.y < 0) || (this.point0.y > maxMapY))) {
          this.oldState = this.state;
          this.state = State.BORDER;
          if (this.point0.x < 0) { // в зависимости от границы карты выбираем куда двигаться
            this._chekpoints.unshift(new Point(200, this.point0.y));
          }
          if (this.point0.x > maxMapX) {
            this._chekpoints.unshift(new Point(maxMapX - 200, this.point0.y));
          }
          if (this.point0.y < 0) {
            this._chekpoints.unshift(new Point(this.point0.x, 200));
          }
          if (this.point0.y > maxMapY) {
            this._chekpoints.unshift(new Point(this.point0.x, maxMapY - 200));
          }
        } else {
          const h = Math.sqrt((this._chekpoints[0].x - this._point0.x) * (this._chekpoints[0].x - this._point0.x) +
            (this._chekpoints[0].y - this._point0.y) * (this._chekpoints[0].y - this._point0.y));
          const radiusCheckpointOrTarget = (this.target !== null) ? this.target._radius : 50; // размер зоны достижения цели
          if ((h < radiusCheckpointOrTarget) && (this._state !== State.FOLLOW)) {
            if (this.state === State.BORDER) {  // если завершилы разворот от границы, то продолжаем прошлые действия
              this.state = this.oldState;
              console.log('222');
            }
            this._chekpoints.shift(); // удаляем текущую точку, если достигли цели и не в режиме следования за целью
            if (this._state === State.DOCKING) { // стыкуемся
              this._onDock = this._dockingTarget;
              this._dockingTarget = null;
              this._pointBeforeDock.setValue(this._point0);
              this._state = State.DOCK;
            }
          } else {
              const dt = this.calcAngle(this._chekpoints[0], this._point0);
              const d = this.calcAngle(this._axisF, this._axisR);
              // зная два вектора (ось объекта и вектор к цели) поворачиваем в ближайшую сторону
              const diffAngle = Math.abs(d - dt);
              if (diffAngle > 10) { // если разница больше, то поворачиваем
                if (diffAngle > 180)  { // определяем напраление поворота
                  rot = d < dt ? this._rot : -this._rot;
                } else {
                  rot = d < dt ? -this._rot : this._rot;
                }
              }
              if (this.currentSpeed < this._maxSpeed) { // набор скорости
                this.currentSpeed += this._accSpeed;
              }
              if (this._state === State.FOLLOW) { // регулируем скорость при следовании за целью
                if (h < (this.target._radius * this.followRadius)) { // при приближении к цели ближе указанного
                  if ((h < this.target._radius * (this.followRadius - 2)) && (this.state !== State.BORDER)) {
                    this.oldState = this.state;
                    this.state = State.BORDER;
                    console.log(d * Math.PI / 180);
                    this._chekpoints.unshift(new Point(this.point0.x + Math.sin(d * Math.PI / 180) * 200, this.point0.y + Math.cos(d * Math.PI / 180) * 200));
                  } else {
                    if (h < this.hToTargetOld) {
                      // замедляемся на 2x ускорения (ускорение на 1x выше по коду на этом же цикле), что даёт замедление на 1x
                      this.currentSpeed -= 2 * this._accSpeed;
                      if (this.currentSpeed < 0) {
                        this.currentSpeed = 0;   // останавливаемся. Нет заднего хода
                      }
                    }
                  }
                }
                this.hToTargetOld = h;
              }
          }
        }
      } else { // если не осталось целей для передвижения
        if (this.currentSpeed > 0) {  // и имеем скорость, то тормозим
          this.currentSpeed -= this._accSpeed;
        }
        if (this.currentSpeed < 0)  {
          this.currentSpeed = 0;   // до полной остановки
        }
      }
      this.povorot(rot);
      this.forward(this.currentSpeed);
    } else {
      this._point0.setValue(this._onDock._point0); // двигаемся вместе с объектом, к которому пристыкованы
    }
  }

  checkOnArea(x: number, y: number): boolean {
    const dx = x - this._point0.x;
    const dy = y - this._point0.y;
    return (Math.sqrt(dx * dx + dy * dy) < this._radius);
  }

  moveOnEllipse(){
  }

  setParent(parentFigure: Figure, orbitX: number, orbitY: number, orbitSpeed: number, u: number, du: number) {
  }

  moveToTarget(state: State) {
    if (this._target !== null) {
      this._chekpoints.length = 0;
      this._chekpoints.push(this._target.point0);
      this._state = state;
    }
  }

  undock() {
    this.currentSpeed = this._maxSpeed;
    this.chekpoints.length = 0;
    for (const point of this.points) {
      point.x += (this.point0.x - this.pointBeforeDock.x);
      point.y += (this.point0.y - this.pointBeforeDock.y);
    }
    this._pointBeforeDock.x = 0;
    this._pointBeforeDock.y = 0;
    this._onDock = null;
    this.currentShield = this.maxShield;
    this._state = State.IDLE;
  }

  resetTarget() {
    this._dockingTarget = null;
    this._chekpoints.length = 0;
    this._state = State.IDLE;
    this._target = null;
  }

  logic() {
    if (this.currentHp <= 0) {
      this._state = State.DEAD;
      this.figures.splice(this.figures.indexOf(this), 1);
    }
    if (this.target !== null)  {
      if (this.target._state === State.DEAD) {
        this.target = null;
      }
    }
    if ((this._state === State.FOLLOW) && (this._target === null)) {
      this.resetTarget();
    }
  }

  targetReach(target: Figure, damage: number) {
  }
}
