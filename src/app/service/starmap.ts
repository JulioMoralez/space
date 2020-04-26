import {Point} from './point';
import {Solar} from './solar';
import {element} from 'protractor';

export class Starmap {


  private clicked = false;
  private maxAreaX = 0;
  private maxAreaY = 0;
  private borderMap = 50;
  private scale = 1;
  private deltaScale = this.scale;
  private maxScroll = 7;
  private countScroll = this.maxScroll;
  private point0 = new Point(0, 0);
  private point0old = new Point(0, 0);
  private pointStartClick = new Point(0, 0);
  private solars: Solar[] = null;
  private selected = 0;
  private _target = 0;


  get target(): number {
    return this._target;
  }

  set target(value: number) {
    this._target = value;
  }

  constructor(maxAreaX: number, maxAreaY: number, borderMap: number, solars: Solar[]) {
    this.maxAreaX = maxAreaX;
    this.maxAreaY = maxAreaY;
    this.borderMap = borderMap;
    this.solars = solars;
  }

  draw(ctx: CanvasRenderingContext2D, currentSystem: number, currentFuel: number) {
    if (this.countScroll < this.maxScroll) {
      if (this.scale * this.deltaScale < 1) { // чтобы масштаб не уходил больше единицы
        const shiftX = this.scale === 1 ? 0 : this.point0.x / (this.maxAreaX - this.maxAreaX / this.scale);
        const shiftY = this.scale === 1 ? 0 : this.point0.y / (this.maxAreaY - this.maxAreaY / this.scale);
        this.scale *= this.deltaScale;
        this.countScroll++; // счетчик приближений для плавности
        if (this.point0.x <= this.maxAreaX - this.maxAreaX / this.scale) {
          this.point0.x = this.maxAreaX - this.maxAreaX / this.scale;
        } // чтобы не ушли за край, x0 y0 ставим в крайнее положение
        if (this.point0.y <= this.maxAreaY - this.maxAreaY / this.scale) {
          this.point0.y = this.maxAreaY - this.maxAreaY / this.scale;
        } // делаем смещение x0 y0 чтобы при масштабировании центр оставался в центре
        this.point0.x = shiftX * (this.maxAreaX - this.maxAreaX / this.scale);
        this.point0.y = shiftY * (this.maxAreaY - this.maxAreaY / this.scale);
      } else { // показываем всё карту без смещения
        this.scale = 1;
        this.point0.x = 0;
        this.point0.y = 0;
        this.countScroll = this.maxScroll;
      }
    }
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'orange';
    ctx.fillStyle = 'black';
    ctx.rect(this.borderMap - 20, this.borderMap - 20, this.maxAreaX + 40, this.maxAreaY + 40);
    ctx.fill();
    ctx.stroke();

    let x = 0;
    let y = 0;
    let radius = 0;

    for (const solar of this.solars) {
      if (this.selected === solar.id) {
        radius = solar.radius * 2;
      } else {
        radius = solar.radius;
      }
      x = solar.point0.x / this.scale + this.borderMap + this.point0.x - 2;
      y = solar.point0.y / this.scale + this.borderMap + this.point0.y - 2;
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
      if (this._target === solar.id) { // выбранная система
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0F0';
        if (this.scale >= 0.7) {
          ctx.beginPath();
          ctx.rect(x - 1, y - 35, 2, 20);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.rect(x - 1, y + 15, 2, 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x - 35 , y, 20, 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x + 14 , y, 20, 2);
        ctx.stroke();
      }
      if ((currentSystem + 1) === solar.id) {
        ctx.beginPath(); // радиус прыжка
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'green';
        ctx.arc(x, y, currentFuel * 10 / this.scale,  0, 2 * Math.PI);
        ctx.stroke();
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
        x = solar.point0.x / this.scale + this.borderMap + this.point0.x - solar.radius / 2 - offsetX;
        y = solar.point0.y / this.scale + this.borderMap + this.point0.y - solar.radius / 2 - offsetY;
        if ((Math.sqrt(x * x + y * y)) < solar.radius) {
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
    this._target = this.selected !== 0 ? this.selected : this._target;
    this.clicked = false;
  }

  mouseWheel(deltaY: number) {
      this.deltaScale = deltaY < 0 ? 0.95 : 1.05;
      this.countScroll = 0;
  }
}
