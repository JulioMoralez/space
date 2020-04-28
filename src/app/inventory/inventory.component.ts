import { Component, OnInit } from '@angular/core';
import {GameComponent, Trade} from '../game/game';
import {Equipment, Equip} from '../service/equipment/equipment';
import {Lasergun} from '../service/equipment/lasergun';
import {Goods} from '../service/equipment/goods';
import {Cargobay} from '../service/equipment/cargobay';
import {State} from '../service/figure';
import {Armor} from '../service/equipment/armor';
import {Shield} from '../service/equipment/shield';


export enum Menu {
  TARGET, STAT, INVENTORY
}

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
  menu = Menu.STAT;
  private index = -1;
  bstyle0 = 'btn btn-outline-info my-2 my-sm-0 mx-1 bs0';
  bstyle1 = 'btn btn-outline-info my-2 my-sm-0 mx-1 bs1';
  bstyle2 = 'btn btn-outline-info my-2 my-sm-0 mx-1 bs2';
  private oldCargo: number;


  constructor(public game: GameComponent) { }

  ngOnInit(): void {
    for (let i = 0; i < this.game.playerShip.maxCargo; i++) {
      this.game.inventory.push(this.game.emptyEquipment);
    }
    this.game.inventory[0] = new Lasergun(3);
    this.game.inventory[1] = new Lasergun(2);
    this.game.inventory[2] = new Goods(2);
    this.game.inventory[3] = new Cargobay(1);
    this.game.inventory[4] = new Cargobay(1);
    this.game.inventory[5] = new Cargobay(1);
    this.game.inventory[6] = new Cargobay(1);
    this.game.inventory[7] = new Cargobay(1);
    this.game.playerShip.currentCargo = this.calcFullCargo();

    for (let i = 0; i < 32; i++) {
      this.game.market.push(this.game.emptyEquipment);
    }
    this.game.market[0] = new Armor(3);
    this.game.market[1] = new Shield(3);
    this.game.market[2] = new Armor(3);
    this.game.market[3] = new Armor(3);
    this.game.market[4] = new Armor(1);
  }

  calcFullCargo(): number{
    return this.game.inventory.filter(value => value !== this.game.emptyEquipment).length;
  }

  getInfo(i: number) {
    if (this.game.playerShip.equipments.has(i)) {
      this.game.trade = Trade.SHIP;
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

    // this.inventory.id = this.equipment.id;
    // this.inventory.name = this.equipment.name;
    // this.inventory.info = this.equipment.info;
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

  }

  viewTarget() {
    this.menu = Menu.TARGET;
  }

  viewStat() {
    this.menu = Menu.STAT;
  }

  viewInventory() {
    this.menu = Menu.INVENTORY;
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


}
