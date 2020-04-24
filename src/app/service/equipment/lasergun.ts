import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';
import {Laser} from '../laser';

export class Lasergun extends Equipment{

  private _damage = 2;
  private _energy = 1;
  private _speed = 100;
  private _maxRange = 100;

  constructor() {
    super();
    this.type = Equip.LASERGUN;
    this.id = 1;
    this.name = 'Лазер 1';
    this.info.push('Урон: ' + this._damage);
    this.info.push('Расход энергии: ' + this._energy);
    this.info.push('Скорость: ' + this._speed);
    this.info.push('Дальность: ' + this._maxRange);
  }

  get maxRange(): number {
    return this._maxRange;
  }

  set maxRange(value: number) {
    this._maxRange = value;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(value: number) {
    this._speed = value;
  }

  get damage(): number {
    return this._damage;
  }

  set damage(value: number) {
    this._damage = value;
  }


  get energy(): number {
    return this._energy;
  }

  set energy(value: number) {
    this._energy = value;
  }

  fireLaser(ship: Ship) {
    if ((ship.target !== null) && (ship.target !== ship)) {
      if (ship.currentEnergy - this._energy >= 0 ) { // проверка, что хватает энергии
        // расчитываем угол между кораблёс и целью
        const t1 = (Math.atan2(ship.axisF.x - ship.axisR.x, ship.axisF.y - ship.axisR.y)  - Math.PI / 2) * 180 / Math.PI;
        const t2 = (Math.atan2(ship.target.point0.x - ship.point0.x, ship.target.point0.y - ship.point0.y)  - Math.PI / 2) * 180 / Math.PI;
        if (Math.abs(t1 - t2) < 45) { // front
          ship.currentEnergy -= this._energy;
          ship.figures.push(new Laser(ship));
        }
        // if (((t1 - t2) > -225) && ((t1 - t2) < -135)) { // для стрельбы назад
        //   ship.capacitor.currentEnergy -= this.energy;
        //   ship.figures.push(new Laser(ship));
        // }
      }
    }
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
  }

}
