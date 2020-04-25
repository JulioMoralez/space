import {Point} from './point';
import {Solar} from './solar';
import {element} from 'protractor';

export class Starmap {


  private clicked = false;
  private maxAreaX = 0;
  private maxAreaY = 0;
  private borderMap = 50;
  private scale = 1;
  private point0 = new Point(0, 0);
  private point0old = new Point(0, 0);
  private pointStartClick = new Point(0, 0);
  private solars: Solar[] = null;
  private radius = 4;
  private selected = 0;


  constructor(maxAreaX: number, maxAreaY: number, borderMap: number, solars: Solar[]) {
    this.maxAreaX = maxAreaX;
    this.maxAreaY = maxAreaY;
    this.borderMap = borderMap;
    this.solars = solars;
  }

  draw(ctx: CanvasRenderingContext2D){
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'orange';
    ctx.fillStyle = 'black';
    ctx.rect(this.borderMap, this.borderMap, this.maxAreaX, this.maxAreaY);
    ctx.fill();
    ctx.stroke();

    let x = 0;
    let y = 0;
    let radius = this.radius;

    for (const solar of this.solars) {
      if (this.selected === solar.id) {
        radius = this.radius * 2;
      } else {
        radius = this.radius;
      }
      x = solar.point0.x / this.scale + this.borderMap + this.point0.x - radius / 2;
      y = solar.point0.y / this.scale + this.borderMap + this.point0.y - radius / 2;
      if ((x > this.borderMap) &&
          (x < this.borderMap + this.maxAreaX) &&
          (y > this.borderMap) &&
          (y < this.maxAreaY + this.borderMap)) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'orange';
        ctx.fillStyle = solar.color;
        ctx.arc(x, y, radius,  0, 2 * Math.PI);
        if (this.scale < 0.7) {
          ctx.font = '18px serif';
          ctx.fillText(solar.name, x - radius - 2, y - radius - 2);
        }
        ctx.stroke();
        ctx.fill();

      }

    }
  }

  start(x: number, y: number) {
    this.clicked = true;
    this.pointStartClick.x = x;
    this.pointStartClick.y = y;
    this.point0old.x = this.point0.x;
    this.point0old.y = this.point0.y;
  }


  use(offsetX: number, offsetY: number) {
    if (this.clicked) {
      if (this.point0old.x - this.pointStartClick.x + offsetX <= 0) {
        if  (this.point0old.x - this.pointStartClick.x + offsetX >= this.maxAreaX - this.maxAreaX / this.scale) {
          this.point0.x = this.point0old.x - this.pointStartClick.x + offsetX;
        } else {
          this.point0.x = this.maxAreaX - this.maxAreaX / this.scale;
        }
      } else {
        this.point0.x = 0;
      }
      if (this.point0old.y - this.pointStartClick.y + offsetY <= 0) {
        if  (this.point0old.y - this.pointStartClick.y + offsetY >= this.maxAreaY - this.maxAreaY / this.scale) {
          this.point0.y = this.point0old.y - this.pointStartClick.y + offsetY;
        } else {
          this.point0.y = this.maxAreaY - this.maxAreaY / this.scale;
        }
      } else {
        this.point0.y = 0;
      }
    } else {
      let x;
      let y;
      let select = 0;

      for (const solar of this.solars) {
        x = solar.point0.x / this.scale + this.borderMap + this.point0.x - this.radius / 2 - offsetX;
        y = solar.point0.y / this.scale + this.borderMap + this.point0.y - this.radius / 2 - offsetY;
        if ((Math.sqrt(x * x + y * y)) < this.radius) {
          this.selected = solar.id;
          select = 1;
          break;
        }
      }
      if (select === 0) {
        this.selected = 0;
      }
    }
  }

  reset() {
    this.clicked = false;
  }

  mouseWheel(deltaY: number) {
    if ((deltaY < 0) || ((this.scale * 1.1 <= 1) && (deltaY > 0))) { // чтобы масштаб не уходил больше единицы
      this.scale = deltaY < 0 ? this.scale / 1.1 : this.scale * 1.1;
      if (this.point0.x <= this.maxAreaX - this.maxAreaX / this.scale) {
        this.point0.x = this.maxAreaX - this.maxAreaX / this.scale;
      }
      if (this.point0.y <= this.maxAreaY - this.maxAreaY / this.scale) {
        this.point0.y = this.maxAreaY - this.maxAreaY / this.scale;
      }
    }
  }
}
