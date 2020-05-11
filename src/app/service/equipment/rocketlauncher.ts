import {Equip, Equipment} from './equipment';
import {Ship} from '../figure/ship';
import {Rocket} from '../figure/rocket';

export class Rocketlauncher extends Equipment{

  private _damage = 1;
  private _speed = 10;
  private _maxRange = 300;
  private _maxHp = 1;

  constructor(i: number) {
    super();
    switch (i) {
      case 0: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = 1;
                break; }
      case 1: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = i * 10;
                break; }
      case 2: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = i * 10;
                break; }
      case 3: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = i * 10;
                break; }
      case 4: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = i * 10;
                break; }
      case 5: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = i * 10;
                break; }
      case 6: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = i * 10;
                break; }
      case 7: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = i * 10;
                break; }
      case 8: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = i * 10;
                break; }
      case 9: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = i * 10;
                break; }
      case 10: { this.damage = i * 10 + 80;  this.speed = i + 8;  this.maxRange = i * 20  + 200;  this.maxHp = 1; this.price = i * 10;
                 break; }
    }
    this.type = Equip.ROCKETLAUNCHER;
    this.id = i;
    this.label = i === 10 ? 'RX' :  'R' + i;
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
