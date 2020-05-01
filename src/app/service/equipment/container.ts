import {Equip, Equipment} from './equipment';

export class Container extends Equipment{

  private _volume = 1;

  get volume(): number {
    return this._volume;
  }

  constructor(i: number) {
    super();
    switch (i) {
      case 0: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
      case 1: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
      case 2: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
      case 3: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
      case 4: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
      case 5: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
      case 6: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
      case 7: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
      case 8: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
      case 9: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
      case 10: {  this._volume = i * 2 + 10; this.price = i * 10; break; }
    }
    this.type = Equip.CONTAINER;
    this.id = i;
    this.label = i === 10 ? 'GX' :  'G' + i;
    this.name = 'Контейнер для товаров';
    this.info.push('Объём: ' + this.volume);
  }
}
