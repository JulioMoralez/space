import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Fueltank extends Equipment {

  private maxFuel = 7;

  constructor() {
    super();
    this.type = Equip.FUELTANK;
    this.id = 1;
    this.name = 'Топливный бак 1';
    this.info.push('Объём бака: ' + this.maxFuel);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxFuel += effect * this.maxFuel;
    ship.currentFuel = ship.maxFuel;
  }

}
