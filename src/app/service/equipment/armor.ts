import {Equip, Equipment} from './equipment';
import {Ship} from '../figure/ship';

export class Armor extends Equipment {

  private maxHp = 1;

  constructor(i: number) {
    super();
    switch (i) {
      case 0: {   this.maxHp = i * 10 + 20;   this.price = 1;   break; }
      case 1: {   this.maxHp = i * 10 + 20;   this.price = i * 10;   break; }
      case 2: {   this.maxHp = i * 10 + 20;   this.price = i * 10;   break; }
      case 3: {   this.maxHp = i * 10 + 20;   this.price = i * 10;   break; }
      case 4: {   this.maxHp = i * 10 + 20;   this.price = i * 10;   break; }
      case 5: {   this.maxHp = i * 10 + 20;   this.price = i * 10;   break; }
      case 6: {   this.maxHp = i * 10 + 20;   this.price = i * 10;   break; }
      case 7: {   this.maxHp = i * 10 + 20;   this.price = i * 10;   break; }
      case 8: {   this.maxHp = i * 10 + 20;   this.price = i * 10;   break; }
      case 9: {   this.maxHp = i * 10 + 20;   this.price = i * 10;   break; }
      case 10: {   this.maxHp = i * 10 + 20;   this.price = i * 10;   break; }
    }
    this.type = Equip.ARMOR;
    this.id = i;
    this.label = i === 10 ? 'AX' : 'A' + i;
    this.name = 'Броня ' + i;
    this.info.push('Объём брони: ' + this.maxHp.toFixed(1));
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxHp += effect * this.maxHp;
    ship.currentHp = ship.maxHp;
  }

}
