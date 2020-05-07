import {Economy, Riches, Solar} from './solar';
import {UtilService} from './util.service';

export class Goods {
  public static FOOD = new Goods(0, 'Продовольствие', 4.4, Economy.AGRO, false);
  public static TEXTILES  = new Goods(1, 'Текстиль', 6.4, Economy.AGRO, false);
  public static RADIOACTIVES  = new Goods(2, 'Радиоактивные руды', 21.2, Economy.INDUSTRY, false);
  public static SLAVES  = new Goods(3, 'Рабы', 8.0, Economy.AGRO, true);
  public static LIQUOR_WINES  = new Goods(4, 'Алкоголь', 	25.2, Economy.AGRO, false);
  public static LUXURIES  = new Goods(5, 'Роскошь', 	91.2, Economy.INDUSTRY, false);
  public static NARCOTICS  = new Goods(6, 'Наркотики', 	114.8, Economy.NONE, true);
  public static COMPUTERS  = new Goods(7, 'Компьютеры', 	84.0, Economy.INDUSTRY, false);
  public static MACHINERY  = new Goods(8, 'Машины', 56.4, Economy.INDUSTRY, false);
  public static ALLOYS  = new Goods(9, 'Лом металлов', 	32.8, Economy.INDUSTRY, false);
  public static FIREARMS  = new Goods(10, 'Оружие', 	70.4, Economy.INDUSTRY, true);
  public static FURS  = new Goods(11, 'Меха', 	56.0, Economy.AGRO, false);
  public static MINERALS  = new Goods(12, 'Минералы', 	8.0, Economy.AGRO, false);
  public static GOLD  = new Goods(13, 'Золото', 	37.2, Economy.NONE, false);
  public static PLATINUM  = new Goods(14, 'Платина', 	65.2, Economy.NONE, false);
  public static GEMSTONES  = new Goods(15, 'Драгоценные камни', 	16.4, Economy.NONE, false);
  public static ALIEN_ITEMS  = new Goods(16, 'Артефакты чужих', 	27.0, Economy.NONE, false);


  private _id: number;
  private _name: string;
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

  get price(): number {
    return this._price;
  }

  get illegal(): boolean {
    return this._illegal;
  }

  constructor(id: number, name: string, price: number, economy: Economy, illegal: boolean) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._illegal = illegal;
    this._economy = economy;
  }

  calcPrice(economy: Economy, riches: Riches): number {
    let price = this.price;
    if (this.economy !== Economy.NONE) {
      if (this.economy === economy) { // если система производитель товара, то цена уменьшается
        price -= (riches.koef * this.price);  // от богатства системы зависит величина отклонения цены
      } else {
        price += (riches.koef * this.price);
      }
    } else {
      // случайное отклонение до 20% для товаров не принадлежащих определенной экономике
      price += (UtilService.getRandomInteger(-20, 20) / 100 * this.price); // возможно убрать надо будет
    }
    price += (UtilService.getRandomInteger(-10, 10) / 100 * this.price); // случайное отклонение до 10% для всех
    return Math.ceil(price * 10) / 10;
  }
}
