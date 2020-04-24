import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Armor extends Equipment {

  private maxHp = 1;

  constructor(i: number) {
    super();
    switch (i) {
      case 1: {
        this.maxHp = 1;
        this.price = 10;
        break;
      }
      case 2: {
        this.maxHp = 2;
        this.price = 20;
        break;
      }
      case 3: {
        this.maxHp = 5;
        this.price = 30;
        break;
      }
    }
    this.type = Equip.ARMOR;
    this.id = i;
    this.label = 'A' + i;
    this.name = 'Броня ' + i;
    this.info.push('Объём брони: ' + this.maxHp);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxHp += effect * this.maxHp;
    ship.currentHp = ship.maxHp;
  }

}
