import {Weapon} from './weapon';
import {Figure, State} from './figure';
import {Point} from './point';

export class Laser extends Weapon{
  private sin = 0;
  private cos = 0;
  private length = 100;
  private speedLaser = 20;


  constructor(launcher: Figure) {
    super(launcher);
    this.damage = 1;
    this.maxRange = 100;
    const dx = this.point0.x - this.target.point0.x;
    const dy = this.point0.y - this.target.point0.y;
    const h = Math.sqrt(dx * dx + dy * dy);
    this.cos = dx / h;
    this.sin = dy / h;
  }

  draw(ctx: CanvasRenderingContext2D, point0: Point) {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.moveTo(this.point0.x + point0.x, this.point0.y + point0.y);
    ctx.lineTo(this.point0.x - this.length * this.cos + point0.x, this.point0.y - this.length * this.sin + point0.y);
    ctx.stroke();
  }

  logic() {
    super.logic();
    this.point0.x -= this.speedLaser * this.cos; // смещаем лазер
    this.point0.y -= this.speedLaser * this.sin;

    for (const figure of this.figures) {
      if (figure !== this.launcher) {
        if (!(figure instanceof Laser)) {
          if (figure.checkOnArea(this.point0.x - this.length * this.cos, this.point0.y - this.length * this.sin)) {
            console.log('12341');
            super.targetReach(this.launcher.lasergun.damage);
            // figure.hp -= this.damage;
            // this.state = State.DEAD;
            // this.figures.splice(this.figures.indexOf(this), 1); // удаляем лазер
            break;
          }
        }
      }
    }
  }

  moveWeapon() {
    super.moveWeapon();
    if (this.currentRange > this.maxRange) { // оружие достигло максисмальной дальности
      this.state = State.DEAD;
      this.figures.splice(this.figures.indexOf(this), 1); // удаляем лазер
    }
  }
}
