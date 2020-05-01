import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Shield extends Equipment{

  private maxShield = 10;
  private accShield = 0.1;


  constructor(i: number) {
    super();
    switch (i) {
      case 0: { this.maxShield = i + 1; this.accShield = 0.1; this.price = 1;  break; }
      case 1: { this.maxShield = i + 1; this.accShield = i * 0.1; this.price = i * 10;  break; }
      case 2: { this.maxShield = i + 1; this.accShield = i * 0.1; this.price = i * 10;  break; }
      case 3: { this.maxShield = i + 1; this.accShield = i * 0.1; this.price = i * 10;  break; }
      case 4: { this.maxShield = i + 1; this.accShield = i * 0.1; this.price = i * 10;  break; }
      case 5: { this.maxShield = i + 1; this.accShield = i * 0.1; this.price = i * 10;  break; }
      case 6: { this.maxShield = i + 1; this.accShield = i * 0.1; this.price = i * 10;  break; }
      case 7: { this.maxShield = i + 1; this.accShield = i * 0.1; this.price = i * 10;  break; }
      case 8: { this.maxShield = i + 1; this.accShield = i * 0.1; this.price = i * 10;  break; }
      case 9: { this.maxShield = i + 1; this.accShield = i * 0.1; this.price = i * 10;  break; }
      case 10: { this.maxShield = i + 1; this.accShield = i * 0.1; this.price = i * 10;  break; }
    }
    this.type = Equip.SHIELD;
    this.id = i;
    this.label = i === 10 ? 'SX' :  'S' + i;
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
