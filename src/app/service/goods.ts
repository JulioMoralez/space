import {Economy, Riches} from './solar';

export class Goods {
  public static FOOD = new Goods(0, 'Пища', 'Пища, органические продукты', 4.4, Economy.AGRO, false);
  public static TEXTILES  = new Goods(1, 'Текстиль', 'Текстиль, грубая материя', 6.4, Economy.AGRO, false);
  public static RADIOACTIVES  = new Goods(2, 'Радиоактивные руды', 'Радиоактивные руды', 21.2, Economy.INDUSTRY, false);
  public static SLAVES  = new Goods(3, 'Рабы', 'Обычно гуманоиды', 8.0, Economy.AGRO, true);


  private _id: number;
  private _name: string;
  private _info: string;
  private _price: number;
  private _illegal: boolean;
  private _economy: Economy;


  get economy(): Economy {
    return this._economy;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get info(): string {
    return this._info;
  }

  get price(): number {
    return this._price;
  }

  get illegal(): boolean {
    return this._illegal;
  }

  constructor(id: number, name: string, info: string, price: number, economy: Economy, illegal: boolean) {
    this._id = id;
    this._name = name;
    this._info = info;
    this._price = price;
    this._illegal = illegal;
    this._economy = economy;
  }

  calcPrice(economy: Economy, riches: Riches): number {
    let price = this.price;
    if (this.economy === economy) { // если система производитель товара, то цена уменьшается
      price -= (riches.koef * this.price);  // от богатства системы зависит величина отклонения цены
    } else {
      price += (riches.koef * this.price);
    }
    return Math.ceil(price * 10) / 10;
  }
}
