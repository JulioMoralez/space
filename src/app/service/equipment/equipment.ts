import {Ship} from '../figure/ship';

export enum Equip {
  ARMOR, CAPACITOR, CARGOBAY, FUELTANK, LASERGUN, ROCKETLAUNCHER, SHIELD, ENGINE, CONTAINER
}

export class Equipment {
  // !!!!!!!!!! получилось плохо с константными именами по умолчанию. Не забывать менять вместе enum
  static names = ['Броня', 'Энергосистема', 'Грузовой отсек', 'Топливный бак', 'Лазер', 'Ракетная установка', 'Щит', 'Двигатель', 'Контейнер'];
  private _id = -1;
  private _label = '00';
  private _name = '';
  private _info: string[] = [];
  private _type: Equip;
  private _price = 0;


  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  constructor() {
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
