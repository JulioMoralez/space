import {Point} from './point';

export class QuickMenu {

  private _point0: Point = new Point(0, 0);
  private colors: string[] = ['red', 'green', 'blue', 'yellow'];
  private startWidth = 5;
  private currentWidth = 5;
  private endWidth = 10;
  private startRadius = 5;
  private currentRadius = 5;
  private endRadius = 20;
  private click = false;
  private a45 = Math.sqrt(2) / 2;
  private selectedZone = 1;
  private endAnimation = 0;


  get point0(): Point {
    return this._point0;
  }

  set point0(value: Point) {
    this._point0 = value;
  }

  draw(ctx: CanvasRenderingContext2D, point0: Point) {
    if (this.click) {
      let radius = 0;
      for (let i = 1; i <= 4; i++) {
        // рисуем 4 сектора если у нас не завершение выбора, или один выбранный
        if ((this.endAnimation === 0) || (this.endAnimation === 1) && (i === this.selectedZone))  {
          // рисуем внутреннюю точку цветом выбранного элемента
          ctx.beginPath();
          ctx.fillStyle = this.colors[this.selectedZone - 1];
          ctx.arc(this._point0.x + point0.x, this._point0.y + point0.y, this.startRadius, 0, Math.PI * 2 );
          ctx.fill();
          ctx.beginPath();
          // рисуем 4 цветных сектора
          ctx.lineWidth = this.currentWidth;
          ctx.strokeStyle = this.colors[i - 1];
          radius = (i === this.selectedZone) ? this.currentRadius + 10 : this.currentRadius; // у выбранного сектора радиус больше
          ctx.arc(this._point0.x + point0.x, this._point0.y + point0.y, radius + this.endAnimation * 10,
            -Math.PI / 4 + Math.PI / 2 * i,
            Math.PI / 4 + Math.PI / 2 * i);
          ctx.stroke();
        }
      }
      if (this.currentRadius < this.endRadius) {
        if (this.endAnimation === 1) { // если сектор выбран, то анимация медленная
          this.currentRadius ++;
        } else {
          this.currentRadius += 3;
        }
      }
      if (this.currentWidth < this.endWidth) {
        this.currentWidth++;
      }
      // конец анимации выбранного сектора
      if ((this.endAnimation === 1) && (this.currentRadius >= this.endRadius)) {
        this.click = false;
        this.endAnimation = 0;
      }
    }
  }

  start(x: number, y: number, point0: Point) {
    this.click = true;
    this.currentRadius = this.startRadius;
    this.currentWidth = this.startWidth;
    this.selectedZone = 1;  // по умолчанию выберается сектор вниз
    this.endAnimation = 0;
    this._point0.x = x - point0.x;
    this._point0.y = y - point0.y;
  }

  reset(): number {
    if (this.currentRadius < this.endRadius) {
      this.endAnimation = 2;
      this.currentRadius = this.endRadius;
      return  1;  // по умолчанию выберается сектор вниз
    } else {
      this.endAnimation = 1;
      this.currentRadius = this.startRadius;
      return this.selectedZone;
    }
  }

  use(x: number, y: number, point0: Point) {
    // если зажата кнопка и ещё не выбран сектор, то вычисляем, в каком из 4х секторов находимся
    if ((this.click) && (this.endAnimation === 0)) {
      const dx = x - this._point0.x - point0.x;
      const dy = y - this._point0.y - point0.y;
      const h = Math.sqrt(dx * dx + dy * dy);
      const cos = dx / h;
      const sin = dy / h;
      if ((cos > this.a45) && (sin > -this.a45) && (sin < this.a45)) {
        this.selectedZone = 4;
      } else {
        if ((cos < this.a45) && (sin > -this.a45) && (sin < this.a45)) {
          this.selectedZone = 2;
        } else {
          if (sin > 0) {
            this.selectedZone = 1;
          } else {
            this.selectedZone = 3;
          }
        }
      }
    }
  }
}
