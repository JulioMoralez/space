import {Equip, Equipment} from './equipment';
import {Ship} from '../figure/ship';

export class Cargobay extends Equipment {

  private cargo = 4;

  constructor(i: number) {
    super();
    switch (i) {
      case 0: {   this.cargo = 4;   this.price = 1;    break;  }
      case 1: {   this.cargo = 4;   this.price = i * 10;    break;  }
      case 2: {   this.cargo = 4;   this.price = i * 10;    break;  }
      case 3: {   this.cargo = 4;   this.price = i * 10;    break;  }
      case 4: {   this.cargo = 8;   this.price = i * 10;    break;  }
      case 5: {   this.cargo = 8;   this.price = i * 10;    break;  }
      case 6: {   this.cargo = 8;   this.price = i * 10;    break;  }
      case 7: {   this.cargo = 12;   this.price = i * 10;    break;  }
      case 8: {   this.cargo = 12;   this.price = i * 10;    break;  }
      case 9: {   this.cargo = 12;   this.price = i * 10;    break;  }
      case 10: {   this.cargo = 12;   this.price = i * 10;    break;  }
    }
    this.type = Equip.CARGOBAY;
    this.id = i;
    this.label = i === 10 ? 'TX' :  'T' + i;
    this.name = 'Грузовой отсек ' + i;
    this.info.push('Дополнительный объём: ' + this.cargo);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxCargo += effect * this.cargo;
  }
}
