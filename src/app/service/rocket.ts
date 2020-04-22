import {Figure, State} from './figure';
import {Point} from './point';
import {Line} from './line';
import {Weapon} from './weapon';

export class Rocket extends Weapon{

  constructor(launcher: Figure) {
    super(launcher);
    this.damage = 1;
    this.maxHp = 1;
    this.hp = this.maxHp;
    this.maxSpeed = 10;
    this.scale = 0.3;
    this.radius = 100 * this.scale;
    this.maxRange = 200;
    this.points.push(new Point(this.point0.x, this.point0.y - 150 * this.scale));
    this.points.push(new Point(this.point0.x + 20 * this.scale, this.point0.y - 40 * this.scale));
    this.points.push(new Point(this.point0.x + 20 * this.scale, this.point0.y));
    this.points.push(new Point(this.point0.x + 50 * this.scale, this.point0.y + 120 * this.scale));
    this.points.push(new Point(this.point0.x + 20 * this.scale, this.point0.y + 120 * this.scale));
    this.points.push(new Point(this.point0.x + 20 * this.scale, this.point0.y + 150 * this.scale));
    this.points.push(new Point(this.point0.x - 20 * this.scale, this.point0.y + 150 * this.scale));
    this.points.push(new Point(this.point0.x - 20 * this.scale, this.point0.y + 120 * this.scale));
    this.points.push(new Point(this.point0.x - 50 * this.scale, this.point0.y + 120 * this.scale));
    this.points.push(new Point(this.point0.x - 20 * this.scale, this.point0.y));
    this.points.push(new Point(this.point0.x - 20 * this.scale, this.point0.y - 40 * this.scale));

    this.setAxis(this.points[0], this.point0);
    const color = 'red';
    const width = 1;
    this.lines.push(new Line(0, 1, color, width));
    this.lines.push(new Line(1, 5, color, width));
    this.lines.push(new Line(2, 3, color, width));
    this.lines.push(new Line(3, 4, color, width));
    this.lines.push(new Line(5, 6, color, width));
    this.lines.push(new Line(6, 10, color, width));
    this.lines.push(new Line(7, 8, color, width));
    this.lines.push(new Line(8, 9, color, width));
    this.lines.push(new Line(10, 0, color, width));
    this.povorot(this.angle);
    this.chekpoints.push(this.target.point0);
  }

  logic() {
    super.logic();
    if (this.target === null) {
      this.chekpoints.length = 0;
    }
  }

  moveWeapon() {
    super.moveWeapon();
    if (this.currentRange > this.maxRange) { // закончилось топливо у ракеты
      this.chekpoints.length = 0;
      this.target = null;   // останавливаем ракету
    }
  }
}
