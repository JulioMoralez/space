import { Component, OnInit } from '@angular/core';
import {GameComponent} from '../game/game';
import {Equipment, Equip} from '../service/equipment/equipment';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  public id = 0;
  public name = '';
  public info: string[] = [];
  private  equipment: Equipment;
  public inventory: Equipment[] = [];
  Equip = Equip;
  private index = -1;
  emptyEquipment: Equipment = new Equipment();

  constructor(public game: GameComponent) { }

  ngOnInit(): void {
    this.inventory.push(this.emptyEquipment);
    this.inventory.push(this.emptyEquipment);
    this.inventory.push(this.emptyEquipment);
    this.inventory.push(this.emptyEquipment);
    this.inventory.push(this.emptyEquipment);
    this.inventory.push(this.emptyEquipment);
    this.inventory.push(this.emptyEquipment);
    this.inventory.push(this.emptyEquipment);
  }

  getInfo(e: number) {
    if (this.game.playerShip.equipments.has(e)) {
      this.equipment = this.game.playerShip.equipments.get(e);
      this.id = this.equipment.id;
      this.name = this.equipment.name;
      this.info = this.equipment.info;
    }
  }

  selectPlace(i: number, j: number, n: number) {

  }

  deleteE() {
    this.equipment.install(this.game.playerShip, -1);
    for (let i = 0; i < this.inventory.length ; i++) {
      if (this.inventory[i] === this.emptyEquipment) {
        this.inventory[i] = this.equipment;
        break;
      }
    }
  }

  getInfoFromInv(i: number) {
    this.equipment = this.inventory[i];
    this.index = i;
    this.id = this.equipment.id;
    this.name = this.equipment.name;
    this.info = this.equipment.info;
  }

  setE() {
    let e: Equipment = null;
    if (this.game.playerShip.equipments.has(this.equipment.type)) {
      e = this.game.playerShip.equipments.get(e);
    }
    this.game.playerShip.installEquip(this.equipment);
    this.inventory[this.index] = this.emptyEquipment;
    if (e !== null) {
      this.inventory[this.index] = e;
    }
  }
}
