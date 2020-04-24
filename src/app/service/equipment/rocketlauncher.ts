import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';
import {Rocket} from '../rocket';

export class Rocketlauncher extends Equipment{

  private _damage = 40;
  private _speed = 10;
  private _maxRange = 300;
  private _maxHp = 3;

  constructor() {
    super();
    this.type = Equip.ROCKETLAUNCHER;
    this.id = 1;
    this.name = 'Ракетная установка 1';
    this.info.push('Урон: ' + this._damage);
    this.info.push('Скорость: ' + this._speed);
    this.info.push('Дальность: ' + this._maxRange);
    this.info.push('Броня: ' + this._maxHp);
  }


  get maxRange(): number {
    return this._maxRange;
  }

  set maxRange(value: number) {
    this._maxRange = value;
  }

  get maxHp(): number {
    return this._maxHp;
  }

  set maxHp(value: number) {
    this._maxHp = value;
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

  fireRocket(ship: Ship) {
    if ((ship.target !== null) && (ship.target !== ship)) {
      if (ship.currentRocket > 0) {
        ship.currentRocket--;
        ship.figures.push(new Rocket(ship));
      }
    }
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
  }
}
