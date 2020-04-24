import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Cargobay extends Equipment {

  private cargo = 4;

  constructor(i: number) {
    super();
    switch (i) {
      case 1: {
        this.cargo = 4;
        this.price = 10;
        break;
      }
      case 2: {
        this.cargo = 8;
        this.price = 20;
        break;
      }
      case 3: {
        this.cargo = 12;
        this.price = 30;
        break;
      }
    }
    this.type = Equip.CARGOBAY;
    this.id = i;
    this.label = 'C' + i;
    this.name = 'Грузовой отсек ' + i;
    this.info.push('Дополнительный объём: ' + this.cargo);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxCargo += effect * this.cargo;
  }
}
