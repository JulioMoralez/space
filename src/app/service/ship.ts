import {Figure, State} from './figure';
import {UtilService} from './util.service';
import {Point} from './point';
import {Rocket} from './rocket';
import {GameComponent} from '../game/game.component';
import {Line} from './line';

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
  }

  logic() {
    super.logic();
    if (!this._playerShip) {
      if (this.chekpoints.length === 0) {
        this.chekpoints.push(new Point(UtilService.getRandomInteger(100, 1000), UtilService.getRandomInteger(100, 1000)));
      }
    }
  }

  fire() {
    if ((this.target !== null) && (this.target !== this)) {
      this.figures.push(new Rocket(this));
    }
  }
}
