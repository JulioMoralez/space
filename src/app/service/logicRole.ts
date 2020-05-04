import {Fraction, Role, Ship} from './ship';
import {Point} from './point';
import {Orb, TypeOrb} from './orb';
import {Figure, State} from './figure';


export class LogicRole {

  private role: Role;
  private ship: Ship;
  private maxMapX: number;
  private maxMapY: number;
  private stage = 0;
  private oldStage = 0;
  private oldRole: Role;
  private timer = 0;


  constructor(role: Role, ship: Ship, maxMapX: number, maxMapY: number) {
    this.role = role;
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
    if (this.role !== role) {
      this.oldStage = this.stage;
      this.oldRole = this.role;
      this.stage = 0;
      this.role = role;
      this.ship.target = target;
    }
  }

  returnRole() {
    this.stage = 0;
    this.role = this.oldRole;
  }

  useRole() {
    let anotherShip: Ship;
    for (const figure of this.ship.figures) {
      if ((figure instanceof Ship) && ((figure as Ship) !== this.ship)) {
        anotherShip = figure as Ship;
        if (this.checkDistance(this.ship.point0, anotherShip.point0, 300)) {
          if (this.checkFraction(this.ship.fraction, anotherShip.fraction)) {
            this.newRole(Role.BATTLE, anotherShip);
            break;
          }
        }
      }
    }
    switch (this.role) {
      case Role.PATRUL: {
        switch (this.stage) {
          case 0: {
            this.ship.chekpoints.length = 0;
            this.ship.chekpoints.push(new Point(200, 200));
            // this.ship.chekpoints.push(new Point(200, this.maxMapY - 200));
            // this.ship.chekpoints.push(new Point(this.maxMapX - 200, this.maxMapY - 200));
            // this.ship.chekpoints.push(new Point(this.maxMapX - 200, 200));
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
            for (const figure of this.ship.figures) {
              if ((figure instanceof Orb) && ((figure as Orb).typeOrb === TypeOrb.PLANET)) {
                this.ship.target = figure;
                this.ship.dockingTarget = figure;
                this.ship.moveToTarget(State.DOCKING);
                break;
              }
            }
            this.stage++;
            break;
          }
          case 3: {
            if (this.ship.state === State.DOCK) {
              this.timer = 100;
              this.stage++;
            }
            break;
          }
          case 4: {
            this.timer--;
            if (this.timer < 0) {
              this.stage++;
            }
            break;
          }
          case 5: {
            this.ship.target = null;
            this.ship.dockingTarget = null;
            this.ship.currentHp = this.ship.maxHp;
            this.ship.undock();
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
            if (((this.ship.target !== null) && (this.ship.target.state === State.DEAD)) || (this.ship.target === null)) {
              this.ship.target = null;
              this.ship.battleMode = false;
              this.returnRole();
            }
            break;
          }
        }
        break;
      }
    }
  }
}
