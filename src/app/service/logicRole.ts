import {Fraction, Role, Ship} from './ship';
import {Point} from './point';
import {Orb, TypeOrb} from './orb';
import {Figure, State} from './figure';
import {UtilService} from './util.service';


export class LogicRole {

  private _role: Role;
  private ship: Ship;
  private maxMapX: number;
  private maxMapY: number;
  private stage = 0;
  private oldStage = 0;
  private _oldRole: Role;
  private timer = 0;
  private countOnPlanet = 0;
  private markPlanet: Figure[] = [];


  get oldRole(): Role {
    return this._oldRole;
  }

  set oldRole(value: Role) {
    this._oldRole = value;
  }

  get role(): Role {
    return this._role;
  }

  set role(value: Role) {
    this._role = value;
  }

  constructor(role: Role, ship: Ship, maxMapX: number, maxMapY: number) {
    this._role = role;
    this.ship = ship;
    this.maxMapX = maxMapX;
    this.maxMapY = maxMapY;
  }

  checkDistance(point1: Point, point2: Point, radius: number): boolean { // проверка близости расстояния
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return (Math.sqrt(dx * dx + dy * dy) < radius);
  }

  checkFraction(fraction1: Fraction, fraction2: Fraction): boolean {  // проверка враждебности
    if (fraction1 === Fraction.TRADER) {
      return false;
    }
    if (fraction1 === Fraction.MINER) {
      return false;
    }
    if ((fraction1 === Fraction.POLICE) && (fraction2 === Fraction.PIRATE)) {
      return true;
    }
    if ((fraction1 === Fraction.PIRATE) && (fraction2 !== Fraction.PIRATE)) {
      return true;
    }
    return false;
  }

  newRole(role: Role, target: Figure) {
    if (this._role !== role) {
      this.oldStage = this.stage;
      this._oldRole = this._role;
      this.stage = 0;
      this._role = role;
      this.ship.target = target;
    }
  }

  returnRole() {
    this._role = this._oldRole;
    switch (this._role) {
      case Role.PATRUL: { // возвращаемся в режим патрулирования, сначала детим на планету
        this.ship.chekpoints.length = 0;
        this.stage = 2;
        break;
      }
    }
  }

  findPlanet(): boolean {
    for (const figure of this.ship.figures) {
      if ((figure instanceof Orb) && ((figure as Orb).typeOrb === TypeOrb.PLANET) && (this.markPlanet.indexOf(figure) === -1)) {
        this.markPlanet.push(figure);
        this.ship.target = figure;
        this.ship.dockingTarget = figure;
        this.ship.moveToTarget(State.DOCKING);
        this.stage++;
        return true;
      }
    }
    this.stage += 2;
    return false;
  }

  dockOnPlanet(del: number) {
    switch (this.countOnPlanet) {
      case 0: {
        if (this.ship.state === State.DOCK) {
          this.timer = del;
          this.countOnPlanet++;
        }
        break;
      }
      case 1: {
        this.timer--;
        if (this.timer < 0) {
          this.countOnPlanet++;
        }
        break;
      }
      case 2: {
        this.ship.target = null;
        this.ship.dockingTarget = null;
        this.ship.currentHp = this.ship.maxHp;
        this.ship.undock();
        this.countOnPlanet = 0;
        this.stage--;
        break;
      }
    }
  }

  useRole() {
    let anotherShip: Ship;
    for (const figure of this.ship.figures) {
      if ((figure instanceof Ship) && ((figure as Ship) !== this.ship)) {
        anotherShip = figure as Ship;
        if (this.ship.state !== State.DOCK) {
          if (this.checkDistance(this.ship.point0, anotherShip.point0, 300)) {
            if (this.checkFraction(this.ship.fraction, anotherShip.fraction)) {
              this.newRole(Role.BATTLE, anotherShip);
              break;
            }
          }
        }
      }
    }
    switch (this._role) {
      case Role.PATRUL: {
        switch (this.stage) {
          case 0: {
            this.ship.chekpoints.length = 0;
            this.ship.chekpoints.push(new Point(200, 200));
            this.ship.chekpoints.push(new Point(200, this.maxMapY - 200));
            this.ship.chekpoints.push(new Point(this.maxMapX - 200, this.maxMapY - 200));
            this.ship.chekpoints.push(new Point(this.maxMapX - 200, 200));
            this.stage++;
            break;
          }
          case 1: {
            if (this.ship.chekpoints.length === 0) {
              this.stage++;
            }
            break;
          }
          case 2: {
            this.findPlanet();
            break;
          }
          case 3: {
            this.dockOnPlanet(100);
            break;
          }
          case 4: {
            this.markPlanet.length = 0;
            this.stage = 0;
            break;
          }
        }
        break;
      }
      case Role.BATTLE: {
        switch (this.stage) {
          case 0: {
            this.ship.moveToTarget(State.FOLLOW);
            this.ship.battleMode = true;
            this.stage++;
            break;
          }
          case 1: {
            if (((this.ship.target !== null) && ((this.ship.target.state === State.DEAD) || (this.ship.target.oldState === State.DEAD)))
                    || (this.ship.target === null)) {
              this.ship.target = null;
              this.ship.battleMode = false;
              this.returnRole();
            }
            break;
          }
        }
        break;
      }
      case Role.TRADER: {
        switch (this.stage) {
          case 0: {
            this.findPlanet();
            break;
          }
          case 1: {
            this.dockOnPlanet(100);
            break;
          }
          case 2: {
            this.ship.chekpoints.length = 0;
            this.ship.chekpoints.push(UtilService.getRandomPointOverMap(this.maxMapX, this.maxMapY));
            this.stage++;
            break;
          }
          case 3: {
            if (this.ship.state === State.BORDER) {
              this.ship.state = State.DEAD;
              this.stage++;
            }
            break;
          }
        }
        break;
      }
      case Role.CONVOY: {
        switch (this.stage) {
          case 0: {
            this.ship.moveToTarget(State.FOLLOW);
            this.stage++;
            break;
          }
        }
        break;
      }
      case Role.PIRATE: {
        switch (this.stage) {
          case 0: {
            this.ship.chekpoints.length = 0;
            this.ship.chekpoints.push(new Point(200, this.maxMapY - 200));
            this.ship.chekpoints.push(new Point(this.maxMapX - 200, this.maxMapY - 200));
            this.stage++;
            break;
          }
          case 1: {
            if (this.ship.chekpoints.length === 0) {
              this.stage = 0;
            }
            break;
          }
        }
        break;
      }
    }
  }
}
