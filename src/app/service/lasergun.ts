import {Equipment} from './equipment';
import {Ship} from './ship';
import {Laser} from './laser';

export class Lasergun extends Equipment{

  private energy = 1;
  private _damage = 1;

  get damage(): number {
    return this._damage;
  }

  set damage(value: number) {
    this._damage = value;
  }

  fireLaser(ship: Ship) {
    if ((ship.target !== null) && (ship.target !== ship)) {
      if (ship.capacitor.currentEnergy - this.energy > 0 ) { // проверка, что хватает энергии
        // расчитываем угол между кораблёс и целью
        const t1 = (Math.atan2(ship.axisF.x - ship.axisR.x, ship.axisF.y - ship.axisR.y)  - Math.PI / 2) * 180 / Math.PI;
        const t2 = (Math.atan2(ship.target.point0.x - ship.point0.x, ship.target.point0.y - ship.point0.y)  - Math.PI / 2) * 180 / Math.PI;
        if (Math.abs(t1 - t2) < 45) { // front
          ship.capacitor.currentEnergy -= this.energy;
          ship.figures.push(new Laser(ship));
        }
        // if (((t1 - t2) > -225) && ((t1 - t2) < -135)) { // для стрельбы назад
        //   ship.capacitor.currentEnergy -= this.energy;
        //   ship.figures.push(new Laser(ship));
        // }
      }
    }
  }

}
