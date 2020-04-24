import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Capacitor extends Equipment{

  private maxEnergy = 1;
  private accEnergy = 0.03;

  constructor(i: number) {
    super();
    switch (i) {
      case 1: {
        this.maxEnergy = 1;
        this.accEnergy = 0.03;
        this.price = 10;
        break;
      }
      case 2: {
        this.maxEnergy = 5;
        this.accEnergy = 0.05;
        this.price = 20;
        break;
      }
      case 3: {
        this.maxEnergy = 2;
        this.accEnergy = 0.5;
        this.price = 30;
        break;
      }
    }
    this.type = Equip.CAPACITOR;
    this.id = i;
    this.label = 'E' + i;
    this.name = 'Энергосистема ' + i;
    this.info.push('Объём энергии: ' + this.maxEnergy);
    this.info.push('Пополнение: ' + this.accEnergy);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxEnergy += effect * this.maxEnergy;
    ship.currentEnergy = ship.maxEnergy;
    ship.maxAccEnergy += effect * this.accEnergy;
    ship.currentAccEnergy = ship.maxAccEnergy;
  }

}
