import {Figure} from './figure';
import {Point} from '../point';
import {Goods} from '../goods';
import {Line} from '../line';

export class Cont extends Figure{

  private contSpeed = 1;
  private _good: Goods;
  private _volume = 0;


  get volume(): number {
    return this._volume;
  }

  set volume(value: number) {
    this._volume = value;
  }

  constructor(point0: Point, figures: Figure[], good: Goods, volume: number) {
    super(point0);
    this.name = 'Контейнер';
    this.figures = figures;
    this._good = good;
    this._volume = volume;
    this.maxHp = 1;
    this.currentHp = this.maxHp;
    let type = 0;
    switch (type) {
      case 0: {
        this.contSpeed = 1;
        this.scale = 1;
        this.radius = 30 * this.scale;
        this.points.push(new Point(point0.x, point0.y - 15 * this.scale));
        this.points.push(new Point(point0.x, point0.y + 15 * this.scale));
        this.points.push(new Point(point0.x + 15 * this.scale, point0.y + 15 * this.scale));
        this.points.push(new Point(point0.x - 15 * this.scale, point0.y + 15 * this.scale));
        this.setAxis(this.points[0], this.points[1]);
        const color = 'yellow';
        const width = 1;
        this.lines.push(new Line(0, 2, color, width));
        this.lines.push(new Line(2, 3, color, width));
        this.lines.push(new Line(3, 0, color, width));
        break;
      }
        case 1: {

          break;
        }
    }
  }


  get good(): Goods {
    return this._good;
  }

  set good(value: Goods) {
    this._good = value;
  }

  draw(ctx: CanvasRenderingContext2D, point0: Point) {
    super.draw(ctx, point0);
    this.povorot(1);
    // this.lines.forEach(line => {
    //   ctx.beginPath();
    //   ctx.strokeStyle = line.color;
    //   ctx.lineWidth = line.width;
    //   ctx.moveTo(this.points[line.p1].x + point0.x, this.points[line.p1].y + point0.y);
    //   ctx.lineTo(this.points[line.p2].x + point0.x, this.points[line.p2].y + point0.y);
    //   ctx.stroke();
    //   this.povorot(0.5);
    // });
  }

  moveToFigure(figure: Figure) {
    const dx = this.point0.x - figure.point0.x;
    const dy = this.point0.y - figure.point0.y;
    const h = Math.sqrt(dx * dx + dy * dy);
    const cos = this.contSpeed * dx / h;
    const sin = this.contSpeed * dy / h;
    for (const point of this.points) {  // смещаем контейнер к цели
      point.x -= cos;
      point.y -= sin;
    }
    this.point0.x -= cos;
    this.point0.y -= sin;
  }

}
