import {Figure} from './figure';
import {Point} from './point';
import {Goods} from './goods';
import {Solar} from './solar';

export enum TypeOrb {
  SUN, PLANET, SATELLITE
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
  private _goods: number[] = [];

  get goods(): number[] {
    return this._goods;
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
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.colorBorder;
    ctx.fillStyle = this.colorFill;
    ctx.arc(this.point0.x   + point0.x, this.point0.y   + point0.y, this.radius,  0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
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

  createGoods(solar: Solar, goods: Goods[]) { // считаем стоимость товаров на планете
    this._goods.length = 0;
    goods.forEach(value => this._goods.push(value.calcPrice(solar.economy, solar.riches)));
  }

  logic() { // объект данного типа не может быть уничтожен, не учитываем hp < 0
  }
}
