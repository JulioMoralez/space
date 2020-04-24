import {Equip, Equipment} from './equipment';

export class Goods extends Equipment{

  constructor(i: number) {
    super();
    switch (i) {
      case 1: {
        this.price = 10;
        this.id = i;
        this.label = 'G' + i;
        this.name = 'FOOD';
        this.info.push('Описание товара');
        break;
      }
      case 2: {
        this.price = 20;
        this.id = i;
        this.label = 'G' + i;
        this.name = 'COMPUTERS';
        this.info.push('Описание товара');
        break;
      }
      case 3: {
        this.price = 30;
        this.id = i;
        this.label = 'G' + i;
        this.name = 'SLAVES';
        this.info.push('Описание товара');
        break;
      }
    }
    this.type = Equip.GOODS;
  }
}
