import {Weapon} from './weapon';
import {Figure, State} from './figure';
import {Point} from './point';
import {Ship} from './ship';
import {Equip} from './equipment/equipment';

export class Laser extends Weapon{
  private sin = 0;
  private cos = 0;
  private length = 100;
  private laserSpeed = 0;

  constructor(launcher: Ship) {
    super(launcher);
    if (this.launcher.equipments.has(Equip.LASERGUN)) {
      const l = this.launcher.equipments.get(Equip.LASERGUN);
      this.damage = l.damage;
      this.maxRange = l.maxRange;
      this.laserSpeed = l.speed;
    }
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
    this.point0.x -= this.laserSpeed * this.cos; // смещаем лазер
    this.point0.y -= this.laserSpeed * this.sin;
    if (this.target !== null) {
      // лазер летит к цели, ничего не перекрывает его
      if (this.target.checkOnArea(this.point0.x - this.length * this.cos, this.point0.y - this.length * this.sin)) {
        super.targetReach(this.target, this.damage);
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
