import {GameComponent} from '../game/game';
import {Fraction, Role, Ship} from './figure/ship';
import {Point} from './point';
import {LogicRole} from './logicRole';
import {UtilService} from './util.service';

export class Scheduler {

  private game: GameComponent;
  private roles: Role[] = [Role.PATRUL, Role.TRADER, Role.PIRATE, Role.MINER];

  constructor(game: GameComponent) {
    this.game = game;
  }

  generateNPC() { // в зависимости от уровня системы генерируем корабли
    const level = this.game.solars[this.game.currentSystem].techLevel;
    this.roles.forEach(value => {
      value.currentShip = 0;
      value.currentCreateTimeout = 1;
      switch (value) {
        case Role.PATRUL: {
          if (level < 5) {
            value.maxShip = 1;
          } else {
            value.reload = true;
            value.maxShip = 2;
          }
          break;
        }
        case Role.TRADER: {
          value.reload = true;
          value.maxShip = 1;
          break;
        }
        case Role.PIRATE: {
          if (level < 5) {
            value.reload = true;
            value.maxShip = 2;
          } else {
            value.maxShip = 1;
          }
          break;
        }
        case Role.MINER: {
          value.maxShip = 1;
          break;
        }
      }
    });
  }

  schedule() {
    this.roles.filter(value => value.reload).forEach(value => {
      value.currentShip = 0;
      if (value.currentCreateTimeout <= 0) {
        value.currentCreateTimeout = UtilService.getRandomInteger(500, 1000);
      }
    });
    for (const figure of this.game.figures) { // считаем количество кораблей каждой роли
      if (figure instanceof Ship) {
        const ship = figure as Ship;
        this.roles.filter(value =>
          (value === ship.logicRole.role || value === ship.logicRole.oldRole)).forEach(value => value.currentShip++);
      }
    }
    this.roles.forEach(value => {
      for (let i = value.currentShip; i < value.maxShip; i++) {
        value.currentCreateTimeout--;
        if (value.currentCreateTimeout <= 0) {
          this.createShip(value);
          break;
        }
      }
    });
  }


  private createShip(value: Role) {
    switch (value) {
      case Role.PATRUL: {
        const ship = new Ship(3,
          UtilService.getRandomPointIntoMap(this.game.maxMapX, this.game.maxMapY), this.game.figures);
        ship.logicRole = new LogicRole(Role.PATRUL, ship, this.game.maxMapX, this.game.maxMapY);
        ship.fraction = Fraction.POLICE;
        this.game.figures.push(ship);
        break;
      }
      case Role.TRADER: {
        const ship = new Ship(5, UtilService.getRandomPointOverMap(this.game.maxMapX, this.game.maxMapY), this.game.figures);
        ship.logicRole = new LogicRole(Role.TRADER, ship, this.game.maxMapX, this.game.maxMapY);
        ship.fraction = Fraction.TRADER;
        this.game.figures.push(ship);
        break;
      }
      case Role.PIRATE: {
        const ship = new Ship(UtilService.getRandomInteger(6, 7),
          UtilService.getRandomPointIntoMap(this.game.maxMapX, this.game.maxMapY), this.game.figures);
        ship.logicRole = new LogicRole(Role.PIRATE, ship, this.game.maxMapX, this.game.maxMapY);
        ship.fraction = Fraction.PIRATE;
        this.game.figures.push(ship);
        break;
      }
      case Role.MINER: {
        const ship = new Ship(5,
          UtilService.getRandomPointIntoMap(this.game.maxMapX, this.game.maxMapY), this.game.figures);
        ship.logicRole = new LogicRole(Role.MINER, ship, this.game.maxMapX, this.game.maxMapY);
        ship.fraction = Fraction.TRADER;
        this.game.figures.push(ship);
        break;
      }
    }
  }
}
