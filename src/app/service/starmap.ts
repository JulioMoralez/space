import {Point} from './point';
import {Solar} from './solar';
import {element} from 'protractor';

export class Starmap {

  static tableCos: number[] = [];
  static tableSin: number[] = [];

  private clicked = false;
  private maxAreaX = 0;
  private maxAreaY = 0;
  private borderMap = 50;
  private borderBlackField = 20;
  private scale = 1;
  private deltaScale = this.scale;
  private maxScroll = 7;
  private countScroll = this.maxScroll;
  private point0 = new Point(0, 0);
  private point0old = new Point(0, 0);
  private pointStartClick = new Point(0, 0);
  private solars: Solar[] = null;
  private selected = -1;
  private _target = -1;
  private _hyperjumpDistance = 0;


  get hyperjumpDistance(): number {
    return this._hyperjumpDistance;
  }

  set hyperjumpDistance(value: number) {
    this._hyperjumpDistance = value;
  }

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
    for (let i = 0; i <= 361; i++) { // расчитываем значаения заранее. Нужно именно 361, чтобы замкнуть круг, так как рисовать будем с 1
      Starmap.tableCos.push(Math.cos(i * Math.PI / 180));
      Starmap.tableSin.push(Math.sin(i * Math.PI / 180));
    }
  }

  draw(ctx: CanvasRenderingContext2D, currentSystem: number, currentFuel: number) {
    const xl = this.borderMap - this.borderBlackField;
    const xr = this.maxAreaX + this.borderMap + this.borderBlackField;
    const yt = this.borderMap - this.borderBlackField;
    const yb = this.maxAreaY + this.borderMap + this.borderBlackField;
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
    ctx.rect(this.borderMap - this.borderBlackField, this.borderMap - this.borderBlackField,
      this.maxAreaX + 2 * this.borderBlackField, this.maxAreaY + 2 * this.borderBlackField);
    ctx.fill();
    ctx.stroke();

    let x = 0;
    let y = 0;
    let radius = 0;

    for (const solar of this.solars) {
      if (this.selected === solar.id) {
        radius = solar.radius * 2;  // увеличиваем звезду при наведении мыши
      } else {
        radius = solar.radius;
      }
      if (this.scale > 0.3) { // увеличиваем размер звезд при приближении
        radius /= this.scale * 2;
      } else {
        radius /= 0.6;
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
        ctx.stroke();
        ctx.fill();
        if (this.scale < 0.6) { // показывапем названия при приближении
          ctx.fillStyle = 'yellow';
          if (this.scale > 0.3) {
            ctx.font = 8 / this.scale + 'px arial';
          } else {
            ctx.font = 8 / 0.3 + 'px arial';
          }
          ctx.fillText(solar.name, x + 6, y - solar.radius - 4);
        }
      }
      if ((currentSystem) === solar.id) { // наша текущая система
        if ((x < xr - this.borderBlackField) && (x > xl + this.borderBlackField) &&
          (y < yb - this.borderBlackField) && (y > yt + this.borderBlackField)) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#0F0';
          ctx.beginPath();
          ctx.rect(x - 1, y - 35, 2, 20);
          ctx.stroke();
          ctx.beginPath();
          ctx.rect(x - 1, y + 15, 2, 20);
          ctx.stroke();
          ctx.beginPath();
          ctx.rect(x - 35, y, 20, 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.rect(x + 14, y, 20, 2);
          ctx.stroke();
        }
        ctx.beginPath(); // рисуем радиус прыжка
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'green';
        const r = currentFuel * 10 / this.scale;
        let xcos;
        let ysin;
        let startAngle = 0;
        let endAngle = 0;
        for (let i = 0; i <= 361; i++) {
          xcos = x + r * Starmap.tableCos[i];
          ysin = y + r * Starmap.tableSin[i];
          if ((xcos > xr) || (xcos < xl) || (ysin > yb) || (ysin < yt)) {
            if (startAngle !== endAngle) {
              ctx.beginPath();
              ctx.arc(x, y, r,  (startAngle + 1) * Math.PI / 180, endAngle * Math.PI / 180);
              ctx.stroke();
            }
            startAngle = i;
            endAngle = i;
          } else {
            endAngle = i;
          }
        }
        if (startAngle !== endAngle) {
          ctx.beginPath();
          ctx.arc(x, y, r,  (startAngle + 1) * Math.PI / 180, endAngle * Math.PI / 180);
          ctx.stroke();
        }

      }
      if (this._target === solar.id) { // выбранная система
        if ((x < xr - this.borderBlackField) && (x > xl + this.borderBlackField) &&
          (y < yb - this.borderBlackField) && (y > yt + this.borderBlackField)) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#F00';
          ctx.beginPath();
          ctx.rect(x - 1, y - 25, 2, 10);
          ctx.stroke();
          ctx.beginPath();
          ctx.rect(x - 1, y + 15, 2, 10);
          ctx.stroke();
          ctx.beginPath();
          ctx.rect(x - 25, y, 10, 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.rect(x + 14, y, 10, 2);
          ctx.stroke();
        }
      }
    }
    // название выбранной системы
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.font = 18 + 'px arial';
    ctx.fillText(this.solars[currentSystem].name, xl, yb);
    if ((this._target !== -1) && (this._target !== currentSystem)) {
      ctx.fillText('-->   ' + this.solars[this._target].name, xl + 100, yb);
      const dx = this.solars[currentSystem].point0.x - this.solars[this._target].point0.x;
      const dy = this.solars[currentSystem].point0.y - this.solars[this._target].point0.y;
      this._hyperjumpDistance = Math.round(Math.sqrt(dx * dx + dy * dy)) / 10;
      ctx.fillText(this._hyperjumpDistance.toFixed(1).toString(), xl + 300, yb);
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
        if ((Math.sqrt(x * x + y * y)) < 2 * solar.radius) {
          this.selected = solar.id;
          select = 1;
          break;
        }
      }
      if (select === 0) {
        this.selected = -1;
      }
    }
  }

  reset() {
    this._target = this.selected !== -1 ? this.selected : this._target;
    this.clicked = false;
  }

  mouseWheel(deltaY: number) {
      this.deltaScale = deltaY < 0 ? 0.95 : 1.05;
      this.countScroll = 0;
  }


}
