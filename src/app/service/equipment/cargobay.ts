import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Cargobay extends Equipment {

  private cargo = 8;

  constructor() {
    super();
    this.type = Equip.CARGOBAY;
    this.id = 1;
    this.name = 'Грузовой отсек 1';
    this.info.push('Дополнительный объём: ' + this.cargo);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.cargo += effect * this.cargo;
  }
}
