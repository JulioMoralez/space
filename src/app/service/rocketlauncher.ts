import {Equipment} from './equipment';
import {Ship} from './ship';
import {Rocket} from './rocket';

export class Rocketlauncher extends Equipment{

  private _maxRocket = 3;
  private _currentRocket = this._maxRocket;
  private _damage = 1;


  get damage(): number {
    return this._damage;
  }

  set damage(value: number) {
    this._damage = value;
  }

  get maxRocket(): number {
    return this._maxRocket;
  }

  set maxRocket(value: number) {
    this._maxRocket = value;
  }

  get currentRocket(): number {
    return this._currentRocket;
  }

  set currentRocket(value: number) {
    this._currentRocket = value;
  }

  fireRocket(ship: Ship) {
    if ((ship.target !== null) && (ship.target !== ship)) {
      if (ship.rocketlauncher._currentRocket > 0) {
        ship.rocketlauncher._currentRocket--;
        ship.figures.push(new Rocket(ship));
      }
    }
  }
}
