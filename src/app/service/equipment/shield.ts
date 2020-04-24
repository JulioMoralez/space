import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Shield extends Equipment{

  private maxShield = 10;
  private accShield = 0.1;


  constructor() {
    super();
    this.type = Equip.SHIELD;
    this.id = 1;
    this.name = 'Щит 1';
    this.info.push('Объём щита: ' + this.maxShield);
    this.info.push('Восстановление: ' + this.accShield);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxShield += effect * this.maxShield;
    ship.currentShield = ship.maxShield;
    ship.maxAccShield += effect * this.accShield;
    ship.currentAccShield = ship.maxAccShield;
  }
}
