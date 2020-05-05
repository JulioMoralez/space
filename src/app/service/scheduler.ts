import {GameComponent} from '../game/game';
import {Fraction, Role, Ship} from './ship';
import {Point} from './point';
import {LogicRole} from './logicRole';
import {UtilService} from './util.service';

export class Scheduler {

  private game: GameComponent;
  private maxCountPatrul = 4;
  private currentCountPatrul = 0;
  private maxCountTrader = 0;
  private currentCountTrader = 0;
  private maxCountPirate = 1;
  private currentCountPirate = 0;


  constructor(game: GameComponent) {
    this.game = game;
  }

  schedule() {
    this.currentCountPatrul = 0;
    this.currentCountTrader = 0;
    this.currentCountPirate = 0;
    for (const figure of this.game.figures) {
      if (figure instanceof Ship) {
        const ship = figure as Ship;
        if ((ship.logicRole.role === Role.PATRUL) || (ship.logicRole.oldRole === Role.PATRUL)) {
          this.currentCountPatrul++;
        }
        if ((ship.logicRole.role === Role.TRADER) || (ship.logicRole.oldRole === Role.TRADER)) {
          this.currentCountTrader++;
        }
        if ((ship.logicRole.role === Role.PIRATE) || (ship.logicRole.oldRole === Role.PIRATE)) {
          this.currentCountPirate++;
        }
      }
    }
    for (let i = this.currentCountPatrul; i < this.maxCountPatrul; i++) {
      this.createPatrul();
    }
    for (let i = this.currentCountTrader; i < this.maxCountTrader; i++) {
      this.createTrader();
    }
    for (let i = this.currentCountPirate; i < this.maxCountPirate; i++) {
      this.createPirate();
    }
  }

  createPatrul() {
    const ship = new Ship(4, new Point(UtilService.getRandomInteger(100, this.game.maxMapX - 100),
                                            UtilService.getRandomInteger(100, this.game.maxMapY - 100)), this.game.figures);
    ship.logicRole = new LogicRole(Role.PATRUL, ship, this.game.maxMapX, this.game.maxMapY);
    ship.fraction = Fraction.POLICE;
    this.game.figures.push(ship);
  }

  private createTrader() {
    const ship = new Ship(3, UtilService.getRandomPointOverMap(this.game.maxMapX, this.game.maxMapY), this.game.figures);
    ship.logicRole = new LogicRole(Role.TRADER, ship, this.game.maxMapX, this.game.maxMapY);
    ship.fraction = Fraction.TRADER;
    this.game.figures.push(ship);
  }

  private createPirate() {
    const ship = new Ship(3, new Point(UtilService.getRandomInteger(100, this.game.maxMapX - 100),
      UtilService.getRandomInteger(this.game.maxMapY - 300, this.game.maxMapY - 100)), this.game.figures);
    ship.logicRole = new LogicRole(Role.PIRATE, ship, this.game.maxMapX, this.game.maxMapY);
    ship.fraction = Fraction.PIRATE;
    this.game.figures.push(ship);
  }
}
