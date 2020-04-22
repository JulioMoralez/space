import {Figure, State} from './figure';
import {UtilService} from './util.service';
import {Point} from './point';
import {Line} from './line';
import {Shield} from './shield';
import {Capacitor} from './capacitor';
import {Lasergun} from './lasergun';
import {Rocketlauncher} from './rocketlauncher';

export class Ship extends Figure {

  private _playerShip = false;

  set playerShip(value: boolean) {
    this._playerShip = value;
  }


  constructor(point0: Point, figures: Figure[]) {
    super(point0);
    this.figures = figures;
    this.points.push(new Point(point0.x, point0.y - 50));
    this.points.push(new Point(point0.x + 50, point0.y + 50));
    this.points.push(new Point(point0.x, point0.y + 50));
    this.points.push(new Point(point0.x - 50, point0.y + 50));
    this.setAxis(this.points[0], this.points[2]);
    const color = 'red';
    const width = 1;
    this.lines.push(new Line(0, 1, 'blue', width));
    this.lines.push(new Line(1, 3, color, width));
    this.lines.push(new Line(3, 0, 'green', 5));
    this.lines.push(new Line(0, 2, color, width));
    this.shield = new Shield();
    this.equipments.push(this.shield);
    this.capacitor = new Capacitor();
    this.equipments.push(this.capacitor);
    this.lasergun = new Lasergun();
    this.equipments.push(this.lasergun);
    this.rocketlauncher = new Rocketlauncher();
    this.equipments.push(this.rocketlauncher);
  }

  logic() {
    super.logic();
    if (!this._playerShip) {
      if (this.chekpoints.length === 0) {
        this.chekpoints.push(new Point(UtilService.getRandomInteger(100, 1000), UtilService.getRandomInteger(100, 1000)));
      }
    }
  }

  fireRocket() {
    if (this.rocketlauncher !== null) {
      this.rocketlauncher.fireRocket(this);
    }
  }

  fireLaser() {
    if (this.lasergun !== null) {
      this.lasergun.fireLaser(this);
    }
  }
}
