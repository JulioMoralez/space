import {Component, OnInit} from '@angular/core';
import {Equipment} from '../service/equipment/equipment';
import {Shield} from '../service/equipment/shield';
import {Armor} from '../service/equipment/armor';
import {GameComponent, Trade} from '../game/game';
import {State} from '../service/figure';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {



  private  equipment: Equipment = null;
  private index = -1;
  Trade = Trade;
  State = State;
  myStyle = 'btn btn-outline-info my-2 my-sm-0 mx-1';

  constructor(public game: GameComponent) { }

  ngOnInit(): void {
    for (let i = 0; i < 32; i++) {
      this.game.market.push(this.game.emptyEquipment);
    }
    this.game.market[0] = new Armor(3);
    this.game.market[1] = new Shield(3);
    this.game.market[2] = new Armor(3);
    this.game.market[3] = new Armor(3);
    this.game.market[4] = new Armor(1);
  }

  getInfoFromMarket(i: number) {
      this.equipment = this.game.market[i];
      this.index = i;
      this.game.trade = Trade.MARKET;

    // this.inventory.id = this.equipment.id;
    // this.inventory.name = this.equipment.name;
    // this.inventory.info = this.equipment.info;
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
}
