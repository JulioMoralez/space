import {Point} from './point';

export class Joy {
  private clicked = false; // нажат ли джойстик
  private pointJoy0: Point; // координата центра джойстика
  private pointJoy: Point; // текщая координата джойстика
  private radiusArea = 100; // радиус активной области
  private radiusJoy = 20; // радиус управляющего элемента
  private h = 0; // величина отклонения ждойстика от центра
  private power = 10; // коэффициент влияния отклонения на велечину сиещения
  private shiftX = 0; // смещение точки на X
  private shiftY = 0; // смещение точки на Y
  private block1: Point; // граничная точка верхняя левая
  private block2: Point; // граничная точка нижняя правая

  constructor(point0: Point, block1: Point, block2: Point) {
    this.pointJoy0 = point0;
    this.pointJoy = new Point(point0.x, point0.y);
    this.block1 = block1;
    this.block2 = block2;
  }

  use(x: number, y: number, point0: Point) {
    if (this.clicked) {
      const dx = x - this.pointJoy0.x;
      const dy = y - this.pointJoy0.y;
      this.h = Math.sqrt(dx * dx + dy * dy);
      const cos = this.h !== 0 ? dx / this.h : 1;
      const sin = this.h !== 0 ? dy / this.h : 0;
      if ( this.h > this.radiusArea ) {
        x = this.pointJoy0.x + this.radiusArea * cos;
        y = this.pointJoy0.y + this.radiusArea * sin;
        this.h = this.radiusArea;
      }
      this.pointJoy.x = x;
      this.pointJoy.y = y;

      this.shiftX = this.h / this.power * cos;
      this.shiftY = this.h / this.power * sin;
      // баг (фича) - двигаем сам джойстик
      // this.point0.x += this.shiftX;
      // this.point0.y += this.shiftY;
      this.shiftPoint(point0);
    }
  }

  shiftPoint(point0: Point) {
    if (this.clicked) {
      if (((point0.x - this.shiftX) <= this.block1.x) && ((point0.x - this.shiftX) >= -this.block2.x)) {
        point0.x -= this.shiftX;
      }
      if (((point0.y - this.shiftY) <= this.block1.y) && ((point0.y - this.shiftY) >= -this.block2.y)) {
        point0.y -= this.shiftY;
      }
    }
  }

  start(x: number, y: number, point0: Point) {
      this.clicked = true;
      this.use(x, y, point0);
  }

  checkOnArea(x: number, y: number): boolean {
    const dx = x - this.pointJoy0.x;
    const dy = y - this.pointJoy0.y;
    return (Math.sqrt(dx * dx + dy * dy) < this.radiusArea);
  }

  reset() {
    this.clicked = false;
    this.pointJoy.x = this.pointJoy0.x;
    this.pointJoy.y = this.pointJoy0.y;
    this.h = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.arc(this.pointJoy0.x, this.pointJoy0.y, this.radiusArea, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'hsl(' + (100 + 2 * this.h) + ',100%,40%)';
    ctx.beginPath();
    ctx.arc(this.pointJoy.x, this.pointJoy.y, this.radiusJoy, 0, Math.PI * 2);
    ctx.fill();
  }
}
