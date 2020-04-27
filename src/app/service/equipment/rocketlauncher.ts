import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';
import {Rocket} from '../rocket';

export class Rocketlauncher extends Equipment{

  private _damage = 1;
  private _speed = 10;
  private _maxRange = 300;
  private _maxHp = 1;

  constructor(i: number) {
    super();
    switch (i) {
      case 1: {
        this.damage = 1;
        this.speed = 10;
        this.maxRange = 100;
        this.maxHp = 1;
        this.price = 10;
        break;
      }
      case 2: {
        this.damage = 5;
        this.speed = 100;
        this.maxRange = 100;
        this.maxHp = 1;
        this.price = 20;
        break;
      }
      case 3: {
        this.damage = 10;
        this.speed = 10;
        this.maxRange = 100;
        this.maxHp = 2;
        this.price = 30;
        break;
      }
    }
    this.type = Equip.ROCKETLAUNCHER;
    this.id = i;
    this.label = 'R' + i;
    this.name = 'Ракетная установка ' + i;
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
