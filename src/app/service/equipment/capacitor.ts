import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Capacitor extends Equipment{

  private maxEnergy = 3;
  private accEnergy = 0.03;

  constructor() {
    super();
    this.type = Equip.CAPACITOR;
    this.id = 1;
    this.name = 'Энергосистема 1';
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
