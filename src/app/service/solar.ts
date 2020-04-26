import {Point} from './point';
import {UtilService} from './util.service';
import {Figure} from './figure';
import {Orb, TypeOrb} from './orb';

export class Solar {

  static slog: string[] = [
    'at', 'ar', 'an', 'a',
    'be', 'bi',
    'ce',
    'di',
    'es', 'er', 'ed', 'en',
    'fa',
    'ge',
    'ho',
    'is', 'in',
    'je',
    'ka',
    'la', 'le',
    'ma',
    'or', 'on',
    'qu',
    'ri', 're', 'ra',
    'so', 'si',
    'ti', 'te',
    'us',
    've',
    'xe', 'xo',
    'za'];
  static countGenerate = 0;

  private _id = -1;
  private _name = '';
  private _point0 = new Point (0, 0);
  private _radius = 0;
  private _color = 'hsl(100,100%,40%)';
  private _figures: Figure[] = [];
  private numPlanets = 0;


  get figures(): Figure[] {
    return this._figures;
  }

  set figures(value: Figure[]) {
    this._figures = value;
  }

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    this._radius = value;
  }


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

  static generate(num: number, maxMapX: number, maxMapY: number, maxStarmapX: number, maxStarmapY: number): Solar[] {
    const solars: Solar[] = [];
    let name = '';
    let len = 0;
    let sun: Figure;
    let planet: Figure;
    let r = 0;
    const maxMap = Math.min(maxMapX, maxMapY);
    UtilService.randi = 1;
    for (let i = 0; i < num; i++) { // название системы
      solars.push(new Solar());
      name = '';
      len = UtilService.rand(UtilService.randi + i + 3, 10);
      if (len < 1) {  // число слогов в названии
        len = 1;
      } else {
        if (len < 6) {
          len = 2;
        } else {
          if (len < 10) {
            len = 3;
          } else {
            len = 4;
          }
        }
      }
      for (let j = 0; j < len; j++) {
          name = name + this.slog[UtilService.rand(UtilService.randi + i + 3, this.slog.length - 1)];
      }
      solars[i]._name = name;
      solars[i]._id = i + 1;
    }
    solars[0]._color = 'green';
    UtilService.randi = 1;
    for (let i = 0; i < num; i++) { // координаты на карте
      solars[i]._point0.x = UtilService.rand(UtilService.randi + i + 3, maxStarmapX);
      solars[i]._point0.y = UtilService.rand(UtilService.randi + i + 3, maxStarmapY);
    }
    UtilService.randi = 1;
    for (let i = 0; i < num; i++) { // радиус звезды
      solars[i]._radius = UtilService.rand(UtilService.randi + i + 3, 4) + 3;
    }
    UtilService.randi = 1;
    for (let i = 0; i < num; i++) { // цвет звезды
      solars[i].color = 'hsl(' + (UtilService.rand(UtilService.randi + i + 3, 50) + 10) + ',100%,40%)';
    }
    for (let i = 0; i < num; i++) { // создание солнца в системе
      solars[i]._figures.
      push(new Orb(new Point(maxMapX / 2, maxMapY / 2), TypeOrb.SUN, solars[i]._radius * 25, solars[i]._color, 'yellow'));
    }
    UtilService.randi = 1;
    for (let i = 0; i < num; i++) { // число планет в системе
      solars[i].numPlanets = UtilService.rand(UtilService.randi + i + 3, 2) + 1;
    }
    UtilService.randi = 1;
    for (let i = 0; i < num; i++) { // число планет в системе
      sun = solars[i]._figures[0]; // звезда одна в системе, первая в массиве объеетов
      for (let j = 0; j < solars[i].numPlanets; j++) {
        planet = new Orb(new Point(0, 0), TypeOrb.PLANET,
          UtilService.rand(UtilService.randi + i, 80) + 30,
             'hsl(' + (UtilService.rand(UtilService.randi + i, 360)) + ',100%,40%)',
          'hsl(' + (UtilService.rand(UtilService.randi + i, 360)) + ',100%,40%)');
        r = UtilService.rand(UtilService.randi + i, maxMap / 2 - sun.radius * 4) + sun.radius * 3;
        planet.setParent((sun as Orb),
          r,
          r,
          UtilService.rand(UtilService.randi + i, 400) + 400,
          3,
          UtilService.getRandomInteger(0, 10));
        solars[i]._figures.push(planet);
      }
    }
    // solars.forEach(value => console.log(value.numPlanets));
    console.log(solars);
    return solars;
  }

  createFigures(maxMapX: number, maxMapY: number): Figure[] {
    if (this._figures.length === 0) {
      this._figures.push(new Orb(new Point(maxMapX / 2, maxMapY / 2), TypeOrb.SUN, this._radius * 20, this._color, 'yellow'));
      // this.figures[1] = new Orb(new Point(0, 0), TypeOrb.PLANET, 50, 'yellow', 'green');
      // this.figures[1].setParent((this.figures[0] as Orb), 600, 400, -500,   3   );
      // this.figures[2] = new Orb(new Point(0, 0), TypeOrb.SATELLITE, 20, 'yellow', 'blue');
      // this.figures[2].setParent((this.figures[1] as Orb), 100, 100, 50,   3  );
      // this.figures[3] = new Orb(new Point(0, 0), TypeOrb.SATELLITE, 10, 'orange', 'yellow');
      // this.figures[3].setParent((this.figures[2] as Orb), 100, 50, -40,   Math.PI / 2  );
      // this.figures[4] = new Orb(new Point(0, 0), TypeOrb.SATELLITE, 15, 'yellow', 'yellow');
      // this.figures[4].setParent((this.figures[3] as Orb), 50, 50, 100,   1  );
    }
    return this._figures;
  }
}
