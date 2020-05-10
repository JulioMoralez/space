import {Component, OnInit} from '@angular/core';
import {GameComponent, Menu, Trade} from '../game/game';
import {Equip, Equipment} from '../service/equipment/equipment';
import {Lasergun} from '../service/equipment/lasergun';
import {Container} from '../service/equipment/container';
import {Cargobay} from '../service/equipment/cargobay';
import {State} from '../service/figure/figure';
import {Orb} from '../service/figure/orb';
import {UtilService} from '../service/util.service';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  public id = 0;
  public name = '';
  public price = 0;
  public info: string[] = [];
  public  equipment: Equipment = null;
  Equip = Equip;
  Trade = Trade;
  State = State;
  Menu = Menu;
  changeStr = 'Снять';
  private index = -1;
  bstyle0 = 'btn btn-outline-info my-2 my-sm-0 mx-1 bs0';
  bstyle1 = 'btn btn-outline-info my-2 my-sm-0 mx-1 bs1';
  bstyle2 = 'btn btn-outline-info my-2 my-sm-0 mx-1 bs2';
  bstyle3 = 'btn btn-outline-info bs3';
  private oldCargo: number;
  priceArmor = 1;
  priceFuel = 2;
  priceRocket = 10;


  constructor(public game: GameComponent) { }

  ngOnInit(): void {
    for (let i = 0; i < this.game.playerShip.maxCargo; i++) {
      this.game.inventory.push(this.game.emptyEquipment);
    }
    this.game.inventory[0] = new Container(2);
    this.game.playerShip.currentCargo = this.calcFullCargo();
  }

  calcFullCargo(): number{
    let vol = 0;
    this.game.inventory.filter(value => value.type === Equip.CONTAINER).forEach(value => vol += (value as Container).volume);
    this.game.playerShip.maxVolume = vol;
    return this.game.inventory.filter(value => value !== this.game.emptyEquipment).length;
  }

  getInfo(i: number) {
    if (this.game.playerShip.equipments.has(i)) {
      this.game.trade = Trade.SHIP;
      this.changeStr = 'Снять';
      this.equipment = this.game.playerShip.equipments.get(i);
      this.id = this.equipment.id;
      this.name = this.equipment.name;
      this.price = this.equipment.price;
      this.info = this.equipment.info;
    }
  }

  getInfoFromMarket(i: number) {
    this.equipment = (this.game.playerShip.onDock as Orb).market[i];
    this.index = i;
    this.game.trade = Trade.MARKET;
    this.name = this.equipment.name;
    this.price = this.equipment.price;
    this.info = this.equipment.info;
  }

  changeE() {
    if (this.game.trade === Trade.SHIP) {
      this.deleteE();
    }
    if (this.game.trade === Trade.INVENTORY) {
      this.setE();
    }
  }

  deleteE() {
    let success = 0;
    this.oldCargo = this.game.playerShip.maxCargo;
    for (let i = 0; i < this.game.inventory.length ; i++) {
      if (this.game.inventory[i] === this.game.emptyEquipment) {
        this.equipment.install(this.game.playerShip, -1);
        this.game.inventory[i] = this.equipment;
        if (!this.recalcCargo()) {
          this.equipment.install(this.game.playerShip, 1);
          this.game.inventory[i] = this.game.emptyEquipment;
          this.game.sms('Изменении общего объёма. Недостаточно свободного места', 1);
        } else {
          this.game.sms('Предмет "' + this.equipment.name + '" перенесён в грузовой отсек', 0);
        }
        this.equipment = null;
        this.game.trade = Trade.NONE;
        success = 1;
        break;
      }
    }
    if (success === 0) {
      this.game.sms('Недостаточно свободного места на корабле', 1);
    }
    this.game.playerShip.currentCargo = this.calcFullCargo();
  }

  getInfoFromInv(i: number) {
    this.equipment = this.game.inventory[i];
    this.index = i;
    this.game.trade = Trade.INVENTORY;
    this.changeStr = 'Установить';
    this.id = this.equipment.id;
    this.name = this.equipment.name;
    this.price = this.equipment.price;
    this.info = this.equipment.info;
  }

  setE() {
    let e: Equipment = null;
    this.oldCargo = this.game.playerShip.maxCargo;
    if (this.game.playerShip.equipments.has(this.equipment.type)) { // замена оборудования
      e = this.game.playerShip.equipments.get(this.equipment.type);
      e.install(this.game.playerShip, -1);
    }
    this.equipment.install(this.game.playerShip, 1);
    if (!this.recalcCargo()) {  // проверяем, поместится ли весь груз
      this.equipment.install(this.game.playerShip, -1);
      this.game.sms('Изменении общего объёма. Недостаточно свободного места', 1);
      if (e !== null) {
        e.install(this.game.playerShip, 1);
      }
    } else {
      this.game.sms('Предмет "' + this.equipment.name + '" установлен на корабль', 0);
      if (e !== null) {
        this.game.inventory[this.index] = e;
      } else {
        this.game.inventory[this.index] = this.game.emptyEquipment;
      }
    }
    this.game.trade = Trade.NONE;
    this.game.playerShip.currentCargo = this.calcFullCargo();
  }

  recalcCargo(): boolean { // false - нет места разместить весь груз
    if (this.oldCargo < this.game.playerShip.maxCargo) { // грузовой отсек стал больше
      for (let i = 0; i < this.game.playerShip.maxCargo - this.oldCargo; i++) {
        this.game.inventory.push(this.game.emptyEquipment);
      }
    }
    if (this.oldCargo > this.game.playerShip.maxCargo) { // если грузовой отсек стал меньше
      const currentBusyCargo = this.game.inventory.filter(value => value !== this.game.emptyEquipment).length;
      if (currentBusyCargo <= this.game.playerShip.maxCargo) { // проверяем, влезает ли всё, что имеется
        const newInventory = this.game.inventory.filter(value => value !== this.game.emptyEquipment);
        newInventory.length = this.game.playerShip.maxCargo;
        for (let i = 0; i < newInventory.length; i++) {
          if (newInventory[i] === undefined) {
            newInventory[i] = this.game.emptyEquipment;
          }
        }
        this.game.inventory = newInventory;
      } else {  // иначе не проводим операцию по смене объёма
        return false;
      }
    }
    return true;
  }

  sell() {
    let success = 0;
    if ((this.equipment.type === Equip.CONTAINER) && (this.game.playerShip.currentVolume > 0)) {
      this.game.sms('Невозможно продать контейнер, освободите его', 1);
      return;
    }
    for (let i = 0; i < (this.game.playerShip.onDock as Orb).market.length ; i++) {
      if ((this.game.playerShip.onDock as Orb).market[i] === this.game.emptyEquipment) {
        this.game.sms('Предмет "' + this.equipment.name + '" продан за ' + this.equipment.price.toFixed(1) + ' кредитов', 0);
        (this.game.playerShip.onDock as Orb).market[i] = this.equipment;
        this.game.credits += this.equipment.price;
        this.game.inventory[this.index] = this.game.emptyEquipment;
        this.equipment = null;
        this.game.trade = Trade.NONE;
        success = 1;
        break;
      }
    }
    if (success === 0) {
      this.game.sms('Недостаточно свободного места в магазине', 1);
    }
    this.game.playerShip.currentCargo = this.calcFullCargo();
  }

  buy() {
    if (this.equipment.price <= this.game.credits) {
      let success = 0;
      for (let i = 0; i < this.game.inventory.length ; i++) {
        if (this.game.inventory[i] === this.game.emptyEquipment) {
          this.game.sms('Предмет "' + this.equipment.name + '" куплен за ' + this.equipment.price + ' кредитов', 0);
          this.game.inventory[i] = this.equipment;
          this.game.credits -= this.equipment.price;
          (this.game.playerShip.onDock as Orb).market[this.index] = this.game.emptyEquipment;
          this.equipment = null;
          this.game.trade = Trade.NONE;
          success = 1;
          break;
        }
      }
      if (success === 0) {
        this.game.sms('Недостаточно свободного места на корабле', 1);
      }
    } else {
      this.game.sms('Недостаточно кредитов', 1);
    }
    this.game.playerShip.currentCargo = this.calcFullCargo();
  }

  viewTarget() {
    this.game.menu = Menu.TARGET;
    this.game.messageWithRepeat = '';
  }

  viewInventory() {
    this.game.menu = Menu.INVENTORY;
    this.game.messageWithRepeat = '';
  }

  viewHelp() {
    this.game.menu = Menu.HELP;
    this.game.messageWithRepeat = '';
  }

  viewStarmap() {
    this.game.menu = Menu.MAP;
    this.game.messageWithRepeat = '';
  }

  viewTrade() {
    this.game.menu = Menu.TRADE;
    this.game.messageWithRepeat = '';
  }

  repair() {
    const cr = Math.ceil((this.game.playerShip.maxHp - this.game.playerShip.currentHp) * this.priceArmor);
    if (cr <= this.game.credits) {
      this.game.credits -= cr;
      this.game.playerShip.currentHp = this.game.playerShip.maxHp;
      this.game.sms('Броня полностью отремонтирована за ' + this.priceArmor.toFixed(1) + ' кредитов', 0);
    } else {
      this.game.sms('Недостаточно кредитов', 1);
    }
  }

  addFuel() {
    const cr = Math.ceil((this.game.playerShip.maxFuel - this.game.playerShip.currentFuel) * this.priceFuel);
    if (cr <= this.game.credits) {
      this.game.credits -= cr;
      this.game.playerShip.currentFuel = this.game.playerShip.maxFuel;
      this.game.sms('Бак полностью заправлен за ' + cr.toFixed(1) + ' кредитов', 0);
    } else {
      this.game.sms('Недостаточно кредитов', 1);
    }
  }

  addRocket() {
    if (this.priceRocket <= this.game.credits) {
      this.game.credits -= this.priceRocket;
      this.game.playerShip.currentRocket++;
      this.game.sms('Ракета куплена за ' + this.priceRocket.toFixed(1) + ' кредитов', 0);
    } else {
      this.game.sms('Недостаточно кредитов', 1);
    }
  }


  menuButton1(): string {
    return 'btn btn-info my-2 my-sm-0 mx-1 bs0';
  }

  menuButton2(): string {
    return 'btn btn-outline-info my-2 my-sm-0 mx-1 bs0';
  }

  plusGoods(i: number, price: number) {
    if (this.game.playerShip.currentVolume < this.game.playerShip.maxVolume) {
      if ((this.game.credits - price) >= 0) {
        this.game.playerShip.goodsInBay[i]++;
        this.game.playerShip.currentVolume++;
        this.game.credits -= price;
        this.game.sms('Товар ' + this.game.goods[i].name.toLowerCase() + ' куплен за ' + price.toFixed(1) + ' кредитов', 0);
      } else {
        this.game.sms('Недостаточно кредитов', 1);
      }
    } else {
      this.game.sms('Нет свободного места', 1);
      }
    }

  minusGoods(i: number, price: number) {
    if (this.game.playerShip.goodsInBay[i] > 0) {
      this.game.playerShip.goodsInBay[i]--;
      this.game.playerShip.currentVolume--;
      this.game.credits += price;
      this.game.sms('Товар ' + this.game.goods[i].name.toLowerCase() + ' продан за ' + price.toFixed(1) + ' кредитов', 0);
    }
  }

  plusplusGoods(i: number, price: number) {
    const qt = this.game.playerShip.maxVolume - this.game.playerShip.currentVolume;
    if ((this.game.credits - price * qt) >= 0) {
      this.game.playerShip.goodsInBay[i] += qt;
      this.game.playerShip.currentVolume = this.game.playerShip.maxVolume;
      this.game.credits -= (price * qt);
      if (qt !== 0) {
        this.game.sms(
          'Товар ' + this.game.goods[i].name.toLowerCase() + ' ' + qt + 'ед. куплен за ' + (price * qt).toFixed(1) + ' кредитов', 0);
      } else {
        this.game.sms('Нет свободного места', 1);
      }
    } else {
      this.game.sms('Недостаточно кредитов', 1);
    }
  }

  minusAllGoods() {
    let price = 0;
    this.game.goods.forEach(value => {
      price += (this.getPrice(value.id) * this.game.playerShip.goodsInBay[value.id]);
      this.game.playerShip.goodsInBay[value.id] = 0;
    });
    this.game.credits += price;
    this.game.playerShip.currentVolume = 0;
    if (price > 0) {
      this.game.sms('Продано товаров на сумму ' + price.toFixed(1) + ' кредитов', 0);
    } else {
      this.game.sms('Грузовой отсек пуст', 1);
    }
  }

  mineInRadius(): boolean {
    return this.game.playerShip.mineInRadius();
  }

  getPrice(id: number): number { // стоимость товара на планете
    return (this.game.playerShip.onDock as Orb).goodsPriceOnPlanet[id];
  }

  getNameEquip(equip: Equip): string {
    if (this.game.playerShip.equipments.has(equip)) {
      return this.game.playerShip.equipments.get(equip).name;
    } else {
      return Equipment.names[equip];
    }
  }

  contInRadius(): boolean {
    return this.game.playerShip.contInRadius(this.game.playerShip.takeRadius);
  }

  disableAttack(): boolean { // блокируем кнопку начала атаки
    if ((this.game.playerShip.target === null) || // нет цели
      (!UtilService.inRadius(this.game.playerShip.point0, this.game.playerShip.target.point0, 600)) || // цель далеко
      (!this.game.isMayBattle(this.game.playerShip.target)) || // с целью нельзя сражаться
      // (this.game.playerShip.battleTarget === this.game.playerShip.target) || // уже сражаемся с целью
      (this.game.playerShip.target === this.game.playerShip)) { // цель мы сами
      return true;
    }
    return false;
  }

  getMarket(): Equipment[] {
    return (this.game.playerShip.onDock as Orb).market;
  }
}
