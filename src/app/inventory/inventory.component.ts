import {Component, OnInit} from '@angular/core';
import {GameComponent, Menu, Trade} from '../game/game';
import {Equip, Equipment} from '../service/equipment/equipment';
import {Lasergun} from '../service/equipment/lasergun';
import {Container} from '../service/equipment/container';
import {Cargobay} from '../service/equipment/cargobay';
import {Figure, State} from '../service/figure';
import {Armor} from '../service/equipment/armor';
import {Shield} from '../service/equipment/shield';
import {Orb, TypeOrb} from '../service/orb';


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
  Orb: any;


  constructor(public game: GameComponent) { }

  ngOnInit(): void {
    for (let i = 0; i < this.game.playerShip.maxCargo; i++) {
      this.game.inventory.push(this.game.emptyEquipment);
    }
    this.game.inventory[0] = new Lasergun(3);
    this.game.inventory[1] = new Lasergun(2);
    this.game.inventory[2] = new Container(2);
    this.game.inventory[3] = new Cargobay(1);
    this.game.inventory[4] = new Cargobay(1);
    this.game.inventory[5] = new Cargobay(1);
    this.game.inventory[6] = new Cargobay(1);
    this.game.inventory[7] = new Cargobay(1);
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
    this.equipment = this.game.market[i];
    this.index = i;
    this.game.trade = Trade.MARKET;
    this.name = this.equipment.name;
    this.price = this.equipment.price;
    this.info = this.equipment.info;
  }

  changeE() {
    console.log(this.game.trade);
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
        }
        this.equipment = null;
        this.game.trade = Trade.NONE;
        success = 1;
        break;
      }
    }
    if (success === 0) {
      console.log('недостаточно места на корабле');
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
    if (this.game.playerShip.equipments.has(this.equipment.type)) { // заменв оборудования
      e = this.game.playerShip.equipments.get(this.equipment.type);
      e.install(this.game.playerShip, -1);
    }
    this.equipment.install(this.game.playerShip, 1);
    if (!this.recalcCargo()) {  // проверяем, поместится ли весь груз
      this.equipment.install(this.game.playerShip, -1);
      if (e !== null) {
        e.install(this.game.playerShip, 1);
      }
    } else {
      if (e !== null) {
        this.game.inventory[this.index] = e;
      } else {
        this.game.inventory[this.index] = this.game.emptyEquipment;
      }
    }
    this.game.trade = Trade.NONE;
    this.game.playerShip.currentCargo = this.calcFullCargo();
  }

  private recalcCargo(): boolean { // false - нет места разместить весь груз
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
        console.log('недостаточно места разместить весь груз');
        return false;
      }
    }
    return true;
  }

  sell() {
    let success = 0;
    for (let i = 0; i < this.game.market.length ; i++) {
      if (this.game.market[i] === this.game.emptyEquipment) {
        this.game.market[i] = this.equipment;
        this.game.credits += this.equipment.price;
        this.game.inventory[this.index] = this.game.emptyEquipment;
        this.equipment = null;
        this.game.trade = Trade.NONE;
        success = 1;
        break;
      }
    }
    if (success === 0) {
      console.log('недостаточно места на корабле');
    }
    this.game.playerShip.currentCargo = this.calcFullCargo();
  }

  buy() {
    if (this.equipment.price <= this.game.credits) {
      let success = 0;
      for (let i = 0; i < this.game.inventory.length ; i++) {
        if (this.game.inventory[i] === this.game.emptyEquipment) {
          this.game.inventory[i] = this.equipment;
          this.game.credits -= this.equipment.price;
          this.game.market[this.index] = this.game.emptyEquipment;
          this.equipment = null;
          this.game.trade = Trade.NONE;
          success = 1;
          break;
        }
      }
      if (success === 0) {
        console.log('недостаточно места на корабле');
      }
    } else {
      console.log('недостаточно кредитов');
    }
    this.game.playerShip.currentCargo = this.calcFullCargo();
  }

  viewTarget() {
    this.game.menu = Menu.TARGET;
  }

  viewStat() {
    this.game.menu = Menu.STAT;
  }

  viewInventory() {
    this.game.menu = Menu.INVENTORY;
  }

  repair() {
    const cr = Math.ceil((this.game.playerShip.maxHp - this.game.playerShip.currentHp) * 2);
    if (cr <= this.game.credits) {
      this.game.credits -= cr;
      this.game.playerShip.currentHp = this.game.playerShip.maxHp;
    }
  }

  addFuel() {
    const cr = Math.ceil((this.game.playerShip.maxFuel - this.game.playerShip.currentFuel) * 2);
    if (cr <= this.game.credits) {
      this.game.credits -= cr;
      this.game.playerShip.currentFuel = this.game.playerShip.maxFuel;
    }
  }

  addRocket() {
    const cr = 10;
    if (cr <= this.game.credits) {
      this.game.credits -= cr;
      this.game.playerShip.currentRocket++;
    }
  }


  menuButton1(): string {
    return 'btn btn-info my-2 my-sm-0 mx-1 bs0';
  }

  menuButton2(): string {
    return 'btn btn-outline-info my-2 my-sm-0 mx-1 bs0';
  }

  viewStarmap() {
    this.game.menu = Menu.MAP;
  }

  viewTrade() {
    this.game.menu = Menu.TRADE;
  }

  plusGoods(i: number, price: number) {
    if (this.game.playerShip.currentVolume < this.game.playerShip.maxVolume) {
      if ((this.game.credits - price) >= 0) {
        this.game.goodsInBay[i]++;
        this.game.playerShip.currentVolume++;
        this.game.credits -= price;
      } else {
        console.log('Нет денег');
      }
    } else {
        console.log('Нет места');
      }
    }

  minusGoods(i: number, price: number) {
    if (this.game.goodsInBay[i] > 0) {
      this.game.goodsInBay[i]--;
      this.game.playerShip.currentVolume--;
      this.game.credits += price;
    }
  }

  plusplusGoods(i: number, price: number) {
    const qt = this.game.playerShip.maxVolume - this.game.playerShip.currentVolume;
    if ((this.game.credits - price * qt) >= 0) {
      this.game.goodsInBay[i] += qt;
      this.game.playerShip.currentVolume = this.game.playerShip.maxVolume;
      this.game.credits -= (price * qt);
    } else {
      console.log('Нет денег');
    }
  }

  minusAllGoods() {
    this.game.goods.forEach(value => {
      this.game.credits += (this.getPrice(value.id) * this.game.goodsInBay[value.id]);
      this.game.goodsInBay[value.id] = 0;
    });
    this.game.playerShip.currentVolume = 0;
  }

  isPlanet(target: Figure): boolean {
    if (target instanceof Orb) {
      if ((target as Orb).typeOrb === TypeOrb.PLANET) {
        return true;
      }
    }
    return false;
  }

  getPrice(id: number): number { // стоимость товара на планете
    return (this.game.playerShip.onDock as Orb).goods[id];
  }
}
