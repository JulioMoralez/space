import {Equipment} from './equipment';

export class Capacitor extends Equipment{

  private _maxEnergy = 3;
  private _currentEnergy = this._maxEnergy;
  private acc = 0.03;


  get maxEnergy(): number {
    return this._maxEnergy;
  }

  set maxEnergy(value: number) {
    this._maxEnergy = value;
  }

  get currentEnergy(): number {
    return this._currentEnergy;
  }

  set currentEnergy(value: number) {
    this._currentEnergy = value;
  }

  logic() {
    this._currentEnergy = (this._currentEnergy + this.acc > this.maxEnergy) ? this.maxEnergy : this._currentEnergy + this.acc;
    if (this._currentEnergy < 0) {
      this._currentEnergy = 0;
    }
  }
}
