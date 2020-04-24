import {Ship} from '../ship';

export enum Equip {
  ARMOR, CAPACITOR, CARGOBAY, FUELTANK, LASERGUN, ROCKETLAUNCHER, SHIELD
}

export class Equipment {
  private _id = 0;
  private _name = '';
  private _info: string[] = [];
  private _type: Equip;


  constructor() {
    this._id = -1;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }


  get info(): string[] {
    return this._info;
  }

  set info(value: string[]) {
    this._info = value;
  }


  get type(): Equip {
    return this._type;
  }

  set type(value: Equip) {
    this._type = value;
  }

  logic() {
  }

  install(ship: Ship, effect: number) {
    if (effect > 0) {
      ship.equipments.set(this.type, this);
    } else {
      ship.equipments.delete(this.type);
    }
  }
}
