import {Figure, State} from './figure';
import {Point} from './point';
import {Line} from './line';
import {Weapon} from './weapon';
import {Laser} from './laser';
import {Ship} from './ship';
import {Equip} from './equipment/equipment';

export class Rocket extends Weapon{

  constructor(launcher: Ship) {
    super(launcher);
    if (this.launcher.equipments.has(Equip.ROCKETLAUNCHER)) {
      const r = this.launcher.equipments.get(Equip.ROCKETLAUNCHER);
      this.damage = r.damage;
      this.maxRange = r.maxRange;
      this.maxHp = r.maxHp;
      this.maxSpeed = r.speed;
    }
    this.currentHp = this.maxHp;
    this.currentSpeed = 0;
    this.scale = 0.3;
    this.radius = 100 * this.scale;
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
    if (this.target === null) { // если цель исчезла, то прекращаем движение ракеты
      this.chekpoints.length = 0;
    } else {
      for (const figure of this.figures) {
        if ((figure !== this.launcher) && (figure !== this)) {
          if (!(figure instanceof Laser)) {
            if (figure.checkOnArea(this.point0.x, this.point0.y)) {
              super.targetReach(figure, this.damage);
              break;
            }
          }
        }
      }
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
