import {Figure} from './figure';
import {Point} from './point';
import {Line} from './line';

export enum TypeOrb {
  SUN, PLANET, SATELLITE, STATION, BELT
}

export class Orb extends Figure{

  private _typeOrb: TypeOrb;
  private colorFill = 'yellow';
  private colorBorder = 'red';
  private parentFigure: Orb = null;
  private orbitX = 200; // размер эллипса по x
  private orbitY = 100; // размер эллипса по y
  private orbitSpeed = 100; // сеорость движения по орбите. Обратная величина
  private u = Math.PI; // наклон эллипса
  private du = 0; // Текущий угол. Перемещение объекта по эллипсу
  private cosU = 0; //
  private sinU = 0; //
  private _goodsPriceOnPlanet: number[] = [];


  get goodsPriceOnPlanet(): number[] {
    return this._goodsPriceOnPlanet;
  }

  set goodsPriceOnPlanet(value: number[]) {
    this._goodsPriceOnPlanet = value;
  }

  get typeOrb(): TypeOrb {
    return this._typeOrb;
  }

  set typeOrb(value: TypeOrb) {
    this._typeOrb = value;
  }

  constructor(point0: Point, typeOrb: TypeOrb, radius: number, colorFill: string, colorBorder: string) {
    super(point0);
    this._typeOrb = typeOrb;
    this.radius = radius;
    this.colorFill = colorFill;
    this.colorBorder = colorBorder;
    if (typeOrb === TypeOrb.STATION) {
      this.scale = 2;
      this.radius = 50 * this.scale;
      this.points.push(new Point(point0.x, point0.y - 50 * this.scale));
      this.points.push(new Point(point0.x, point0.y + 50 * this.scale));
      this.points.push(new Point(point0.x + 50 * this.scale, point0.y));
      this.points.push(new Point(point0.x - 50 * this.scale, point0.y));
      this.points.push(new Point(point0.x + 40 * this.scale, point0.y - 40 * this.scale));
      this.points.push(new Point(point0.x - 40 * this.scale, point0.y - 40 * this.scale));
      this.points.push(new Point(point0.x + 40 * this.scale, point0.y + 40 * this.scale));
      this.points.push(new Point(point0.x - 40 * this.scale, point0.y + 40 * this.scale));
      this.points.push(new Point(point0.x + 15 * this.scale, point0.y - 5 * this.scale));
      this.points.push(new Point(point0.x + 15 * this.scale, point0.y + 5 * this.scale));
      this.points.push(new Point(point0.x - 15 * this.scale, point0.y + 5 * this.scale));
      this.points.push(new Point(point0.x - 15 * this.scale, point0.y - 5 * this.scale));
      this.setAxis(this.points[0], this.points[1]);
      const color = 'white';
      const width = 1;
      this.lines.push(new Line(0, 2, color, width));
      this.lines.push(new Line(2, 1, color, width));
      this.lines.push(new Line(1, 3, color, width));
      this.lines.push(new Line(3, 0, color, width));
      this.lines.push(new Line(4, 0, color, width));
      this.lines.push(new Line(4, 2, color, width));
      this.lines.push(new Line(6, 2, color, width));
      this.lines.push(new Line(6, 1, color, width));
      this.lines.push(new Line(7, 1, color, width));
      this.lines.push(new Line(7, 3, color, width));
      this.lines.push(new Line(5, 0, color, width));
      this.lines.push(new Line(5, 3, color, width));
      this.lines.push(new Line(8, 9, color, width));
      this.lines.push(new Line(9, 10, color, width));
      this.lines.push(new Line(10, 11, color, width));
      this.lines.push(new Line(11, 8, color, width));
    }
  }

  setParent(parentFigure: Figure, orbitX: number, orbitY: number, orbitSpeed: number, u: number, du: number) {
    this.parentFigure = (parentFigure as unknown as Orb);
    this.orbitX = orbitX;
    this.orbitY = orbitY;
    this.orbitSpeed = Math.PI / orbitSpeed;
    this.u = u;
    this.du = du;
    this.cosU = Math.cos(u); // заранее считаем один раз
    this.sinU = Math.sin(u); // заранее считаем один раз
  }

  draw(ctx: CanvasRenderingContext2D, point0: Point) {
    if ((this.typeOrb === TypeOrb.SUN) || (this.typeOrb === TypeOrb.PLANET) || (this.typeOrb === TypeOrb.SATELLITE)) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = this.colorBorder;
      ctx.fillStyle = this.colorFill;
      ctx.arc(this.point0.x   + point0.x, this.point0.y   + point0.y, this.radius,  0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }
    if (this.typeOrb === TypeOrb.STATION) {
      this.lines.forEach(line => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.moveTo(this.points[line.p1].x + point0.x, this.points[line.p1].y + point0.y);
        ctx.lineTo(this.points[line.p2].x + point0.x, this.points[line.p2].y + point0.y);
        ctx.stroke();
        this.povorot(0.01);
      });
    }
    if (this.typeOrb === TypeOrb.BELT) {
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = this.colorBorder;
      ctx.arc(this.point0.x   + point0.x, this.point0.y   + point0.y, this.radius,  0, 2 * Math.PI);
      ctx.stroke();
    }

  }

  // moveOnOrbit() {
  //   if (this.parentFigure !== null) {
  //     this.point0.x = this.parentFigure.point0.x + this.orbitRadius * Math.cos(this._deg * Math.PI / 180);
  //     this.point0.y = this.parentFigure.point0.y + this.orbitRadius * Math.sin(this._deg * Math.PI / 180);
  //     this._deg = Math.abs(this._deg) >= 360 ? 0 : this._deg + this.orbitSpeed; // надо доделать -360 вместо 0 !
  //   }
  // }

  moveOnEllipse() {
    if (this.parentFigure !== null) {
      const rx = this.orbitX * Math.cos(this.du);
      const ry = this.orbitY * Math.sin(this.du);
      this.point0.x =  this.parentFigure.point0.x + rx * this.cosU - ry * this.sinU; // this.rotEllipseX(rx, ry, this.u);
      this.point0.y =  this.parentFigure.point0.y + rx * this.sinU - ry * this.cosU; // this.rotEllipseY(rx, ry, this.u);
      if (Math.abs(this.du) >= 2 * Math.PI) { // вычитаем 2PI, чтобы бесконечно не увеличивалась переменная
        this.du = (this.du < 0) ? this.du + 2 * Math.PI : this.du - 2 * Math.PI;
      }
      this.du += this.orbitSpeed;
    }
  }

  // rotEllipseX(x: number, y: number, t: number): number {
  //   return x * Math.cos(t) - y * Math.sin(t);
  // }
  //
  // rotEllipseY(x: number, y: number, t: number): number {
  //   return x * Math.sin(t) - y * Math.cos(t);
  // }

  logic() { // объект данного типа не может быть уничтожен, не учитываем hp < 0
  }
}
