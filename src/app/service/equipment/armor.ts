import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Armor extends Equipment {

  private maxHp = 5;

  constructor() {
    super();
    this.type = Equip.ARMOR;
    this.id = 1;
    this.name = 'Броня 1';
    this.info.push('Объём брони: ' + this.maxHp);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxHp += effect * this.maxHp;
    ship.currentHp = ship.maxHp;
  }

}
