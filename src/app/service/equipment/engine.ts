import {Equip, Equipment} from './equipment';
import {Ship} from '../figure/ship';

export class Engine extends Equipment{

  private maxSpeed = 1;
  private accSpeed = 0.1;

  constructor(i: number) {
    super();
    switch (i) {
      case 0: {   this.maxSpeed = i + 2; this.accSpeed = 0.1; this.price = 1;  break; }
      case 1: {   this.maxSpeed = i + 2; this.accSpeed = i * 0.1; this.price = i * 10;  break; }
      case 2: {   this.maxSpeed = i + 2; this.accSpeed = i * 0.1; this.price = i * 10;  break; }
      case 3: {   this.maxSpeed = i + 2; this.accSpeed = i * 0.1; this.price = i * 10;  break; }
      case 4: {   this.maxSpeed = i + 2; this.accSpeed = i * 0.1; this.price = i * 10;  break; }
      case 5: {   this.maxSpeed = i + 2; this.accSpeed = i * 0.1; this.price = i * 10;  break; }
      case 6: {   this.maxSpeed = i + 2; this.accSpeed = i * 0.1; this.price = i * 10;  break; }
      case 7: {   this.maxSpeed = i + 2; this.accSpeed = i * 0.1; this.price = i * 10;  break; }
      case 8: {   this.maxSpeed = i + 2; this.accSpeed = i * 0.1; this.price = i * 10;  break; }
      case 9: {   this.maxSpeed = i + 2; this.accSpeed = i * 0.1; this.price = i * 10;  break; }
      case 10: {   this.maxSpeed = i + 2; this.accSpeed = i * 0.1; this.price = i * 10;  break; }
    }
    this.type = Equip.ENGINE;
    this.id = i;
    this.label = i === 10 ? 'EX' :  'E' + i;
    this.name = 'Двигатель ' + i;
    this.info.push('Максимальная скорость: ' + this.maxSpeed.toFixed(1));
    this.info.push('Ускорение: ' + this.accSpeed.toFixed(1));
  }

  install(ship: Ship, effect: number) {
    super.install(ship, effect);
    ship.maxSpeed += effect * this.maxSpeed;
    ship.currentSpeed = 0;
    ship.accSpeed = (ship.accSpeed + effect * this.accSpeed) < 0 ? 0 : ship.accSpeed + effect * this.accSpeed;
  }
}
