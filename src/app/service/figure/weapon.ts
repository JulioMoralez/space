import {Figure, State} from './figure';
import {Point} from '../point';
import {Role, Ship} from './ship';

export class Weapon extends Figure{
  private _launcher: Ship = null;
  private _damage = 1;
  private _currentRange = 0;
  private _maxRange = 200;

  constructor(launcher: Ship) {
    super(new Point(launcher.point0.x, launcher.point0.y));
    this.launcher = launcher;
    this.figures = launcher.figures;
    this.target = launcher.target;
    this.angle = launcher.angle;

  }

  get launcher(): Ship {
    return this._launcher;
  }

  set launcher(value: Ship) {
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

  targetReach(target: Figure, damage: number) { // цель достигнута
    if (target === null) {
      return;
    }
    target.toBattleMode(this.launcher); // если цель получила повреждение, то она становится враждебной к тому, кто выстрелил
    let damageHp = target.currentHp; // через локальную переменную, чтобы в анимацию не попадало отрицательных значений
    const damageSh = target.currentShield - damage;
    if (damageSh < 0) {
      target.currentShield = 0;
      damageHp += damageSh;
    } else {
      target.currentShield = damageSh;
    }
    target.currentHp = damageHp < 0 ? 0 : damageHp;
    this.state = State.DEAD;
    this.figures.splice(this.figures.indexOf(this), 1); // удаляем объект с карты
  }
}
