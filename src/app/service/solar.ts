import {Point} from './point';
import {UtilService} from './util.service';

export class Solar {

  static slog: string[] = ['xx', 'of', 'di', 'so', 'le', 'es', 'ti', 'ra', 'la', 've', 'a'];
  static countGenerate = 0;

  private _id = -1;
  private _name = '';
  private _point0 = new Point (0, 0);
  private _color = 'yellow';


  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get point0(): Point {
    return this._point0;
  }

  set point0(value: Point) {
    this._point0 = value;
  }

  static generate(num: number): Solar[] {
    const solars: Solar[] = [];
    let solar: Solar = null;
    let name = '';
    let len = 0;
    for (let i = 0; i < num; i++) {
      name = '';
      len = UtilService.rand(this.countGenerate++, 2);
      for (let j = 0; j < len + 2; j++) {
        name = name + this.slog[UtilService.rand(this.countGenerate++, 10)];
      }
      solar = new Solar();
      solar._id = i + 1;
      if (i === 0) {
        solar._color = 'green';
      }
      solar._name = name;
      solar._point0.x = UtilService.rand(UtilService.randi + i + 3, 950);
      solar._point0.y = UtilService.rand(UtilService.randi + i + 3, 700);
      solars.push(solar);
    }
    return solars;
  }
}
