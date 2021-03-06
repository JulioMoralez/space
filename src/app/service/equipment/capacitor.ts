import {Equip, Equipment} from './equipment';
import {Ship} from '../figure/ship';

export class Capacitor extends Equipment{

  private maxEnergy = 1;
  private accEnergy = 0.03;

  constructor(i: number) {
    super();
    switch (i) {
      case 0: {   this.maxEnergy = 3;   this.accEnergy = 0.1;    this.price = 1;    break; }
      case 1: {   this.maxEnergy = i / 2 + 2;   this.accEnergy = i / 10 + 0.2;    this.price = i * 10;    break; }
      case 2: {   this.maxEnergy = i / 2 + 2;   this.accEnergy = i / 10 + 0.2;    this.price = i * 10;    break; }
      case 3: {   this.maxEnergy = i / 2 + 2;   this.accEnergy = i / 10 + 0.2;    this.price = i * 10;    break; }
      case 4: {   this.maxEnergy = i / 2 + 2;   this.accEnergy = i / 10 + 0.2;    this.price = i * 10;    break; }
      case 5: {   this.maxEnergy = i / 2 + 2;   this.accEnergy = i / 10 + 0.2;    this.price = i * 10;    break; }
      case 6: {   this.maxEnergy = i / 2 + 2;   this.accEnergy = i / 10 + 0.2;    this.price = i * 10;    break; }
      case 7: {   this.maxEnergy = i / 2 + 2;   this.accEnergy = i / 10 + 0.2;    this.price = i * 10;    break; }
      case 8: {   this.maxEnergy = i / 2 + 2;   this.accEnergy = i / 10 + 0.2;    this.price = i * 10;    break; }
      case 9: {   this.maxEnergy = i  / 2 + 2;   this.accEnergy = i / 10 + 0.2;    this.price = i * 10;    break; }
      case 10: {   this.maxEnergy = i / 2 + 2;   this.accEnergy = i / 10 + 0.2;    this.price = i * 10;    break; }
    }
    this.type = Equip.CAPACITOR;
    this.id = i;
    this.label = i === 10 ? 'CX' :  'C' + i;
    this.name = 'Энергосистема ' + i;
    this.info.push('Объём энергии: ' + this.maxEnergy.toFixed(1));
    this.info.push('Пополнение: ' + this.accEnergy.toFixed(1));
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxEnergy += effect * this.maxEnergy;
    ship.currentEnergy = ship.maxEnergy;
    ship.maxAccEnergy += effect * this.accEnergy;
    ship.currentAccEnergy = ship.maxAccEnergy;
  }

}
