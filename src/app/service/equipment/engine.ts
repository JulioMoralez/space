import {Equip, Equipment} from './equipment';
import {Ship} from '../ship';

export class Engine extends Equipment{

  private maxSpeed = 1;
  private accSpeed = 0.1;

  constructor(i: number) {
    super();
    switch (i) {
      case 1: {
        this.maxSpeed = 3;
        this.accSpeed = 0.1;
        this.price = 10;
        break;
      }
      case 2: {
        this.maxSpeed = 5;
        this.accSpeed = 0.2;
        this.price = 20;
        break;
      }
      case 3: {
        this.maxSpeed = 10;
        this.accSpeed = 0.3;
        this.price = 30;
        break;
      }
    }
    this.type = Equip.ENGINE;
    this.id = i;
    this.label = 'E' + i;
    this.name = 'Двигатель ' + i;
    this.info.push('Максимальная скорость: ' + this.maxSpeed);
    this.info.push('Ускорение: ' + this.accSpeed);
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxSpeed += effect * this.maxSpeed;
    ship.currentSpeed = 0;
    ship.accSpeed = (ship.accSpeed + effect * this.accSpeed) < 0 ? 0 : ship.accSpeed + effect * this.accSpeed;
  }
}
