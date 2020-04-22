import {Figure, State} from './figure';
import {Point} from './point';

export class Weapon extends Figure{
  private _launcher: Figure = null;
  private _damage = 1;
  private _currentRange = 0;
  private _maxRange = 200;

  constructor(launcher: Figure) {
    super(new Point(launcher.point0.x, launcher.point0.y));
    this.launcher = launcher;
    this.figures = launcher.figures;
    this.target = launcher.target;
    this.angle = launcher.angle;

  }

  get launcher(): Figure {
    return this._launcher;
  }

  set launcher(value: Figure) {
    this._launcher = value;
  }

  get damage(): number {
    return this._damage;
  }

  set damage(value: number) {
    this._damage = value;
  }


  get currentRange(): number {
    return this._currentRange;
  }

  set currentRange(value: number) {
    this._currentRange = value;
  }

  get maxRange(): number {
    return this._maxRange;
  }

  set maxRange(value: number) {
    this._maxRange = value;
  }

  logic() {
    super.logic();
    this.moveWeapon();
  }

  moveWeapon() {
    this.currentRange++;
  }

  targetReach(damage: number) { // цель достигнута
    if (this.target.shield !== null) {
      console.log(damage);
      this.target.shield.currentShield -= damage;
      if (this.target.shield.currentShield < 0) {
        this.target.hp -= this.target.shield.currentShield;
      }
    } else {
      this.target.hp -= damage;
    }
    this.state = State.DEAD;
    this.figures.splice(this.figures.indexOf(this), 1); // удаляем объект с карты
  }
}
