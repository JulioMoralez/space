import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Fueltank extends Equipment {

  private maxFuel = 1;

  constructor(i: number) {
    super();
    switch (i) {
      case 1: {
        this.maxFuel = 7;
        this.price = 10;
        break;
      }
      case 2: {
        this.maxFuel = 10;
        this.price = 20;
        break;
      }
      case 3: {
        this.maxFuel = 15;
        this.price = 30;
        break;
      }
    }
    this.type = Equip.FUELTANK;
    this.id = i;
    this.label = 'F' + i;
    this.name = 'Топливный бак ' + i;
    this.info.push('Объём бака: ' + this.maxFuel);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxFuel += effect * this.maxFuel;
    ship.currentFuel = ship.maxFuel;
  }

}
