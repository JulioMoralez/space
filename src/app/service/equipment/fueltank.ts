import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Fueltank extends Equipment {

  private maxFuel = 1;

  constructor(i: number) {
    super();
    switch (i) {
      case 0: {   this.maxFuel = i + 7;   this.price = 1;    break; }
      case 1: {   this.maxFuel = i + 7;   this.price = i * 10;    break; }
      case 2: {   this.maxFuel = i + 7;   this.price = i * 10;    break; }
      case 3: {   this.maxFuel = i + 7;   this.price = i * 10;    break; }
      case 4: {   this.maxFuel = i + 7;   this.price = i * 10;    break; }
      case 5: {   this.maxFuel = i + 7;   this.price = i * 10;    break; }
      case 6: {   this.maxFuel = i + 7;   this.price = i * 10;    break; }
      case 7: {   this.maxFuel = i + 7;   this.price = i * 10;    break; }
      case 8: {   this.maxFuel = i + 7;   this.price = i * 10;    break; }
      case 9: {   this.maxFuel = i + 7;   this.price = i * 10;    break; }
      case 10: {   this.maxFuel = i + 7;   this.price = i * 10;    break; }
    }
    this.type = Equip.FUELTANK;
    this.id = i;
    this.label = i === 10 ? 'FX' :  'F' + i;
    this.name = 'Топливный бак ' + i;
    this.info.push('Объём бака: ' + this.maxFuel);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxFuel += effect * this.maxFuel;
    ship.currentFuel = ship.maxFuel;
  }

}
