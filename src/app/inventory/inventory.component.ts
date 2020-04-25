import { Component, OnInit } from '@angular/core';
import {GameComponent, Trade} from '../game/game';
import {Equipment, Equip} from '../service/equipment/equipment';
import {Capacitor} from '../service/equipment/capacitor';
import {Lasergun} from '../service/equipment/lasergun';
import {Armor} from '../service/equipment/armor';
import {Shield} from '../service/equipment/shield';
import {Goods} from '../service/equipment/goods';
import {Cargobay} from '../service/equipment/cargobay';
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
  private index = -1;
  myStyle = 'btn btn-outline-info my-2 my-sm-0 mx-1';
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
  }
}
