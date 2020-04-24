import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Shield extends Equipment{

  private maxShield = 10;
  private accShield = 0.1;


  constructor(i: number) {
    super();
    switch (i) {
      case 1: {
        this.maxShield = 1;
        this.accShield = 0.1;
        this.price = 10;
        break;
      }
      case 2: {
        this.maxShield = 2;
        this.accShield = 0.1;
        this.price = 20;
        break;
      }
      case 3: {
        this.maxShield = 10;
        this.accShield = 0.2;
        this.price = 30;
        break;
      }
    }
    this.type = Equip.SHIELD;
    this.id = i;
    this.label = 'S' + i;
    this.name = 'Щит ' + i;
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
