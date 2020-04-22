import {Equipment} from './equipment';

export class Shield extends Equipment{

  private _maxShield = 3;
  private _currentShield = this._maxShield;
  private acc = 0.1;


  get maxShield(): number {
    return this._maxShield;
  }

  set maxShield(value: number) {
    this._maxShield = value;
  }

  get currentShield(): number {
    return this._currentShield;
  }

  set currentShield(value: number) {
    this._currentShield = value;
  }

  logic() {
    this._currentShield = (this._currentShield + this.acc > this._maxShield) ? this._maxShield : this._currentShield + this.acc;
    if (this._currentShield < 0) {
      this._currentShield = 0;
    }
  }
}
