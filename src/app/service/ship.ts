import {Figure, State} from './figure';
import {UtilService} from './util.service';
import {Point} from './point';
import {Line} from './line';
import {Shield} from './equipment/shield';
import {Capacitor} from './equipment/capacitor';
import {Lasergun} from './equipment/lasergun';
import {Rocketlauncher} from './equipment/rocketlauncher';
import {Equip, Equipment} from './equipment/equipment';
import {Armor} from './equipment/armor';
import {Cargobay} from './equipment/cargobay';
import {Fueltank} from './equipment/fueltank';
import {Engine} from './equipment/engine';

export class Ship extends Figure {

  private _playerShip = false;
  // private _equipments: Equipment[] = [];
  private _equipments = new Map();
  // hp из figure
  // shield из figure
  private _maxEnergy = 3;
  private _currentEnergy = this._maxEnergy;
  private _maxAccEnergy = 0;
  private _currentAccEnergy = this.maxAccEnergy;
  private _maxCargo = 4;
  private _currentCargo = 0;
  private _maxFuel = 0;
  private _currentFuel = this._maxFuel;
  private _maxAccShield = 0;
  private _currentAccShield = this.maxAccShield;
  private _maxRocket = 4;
  private _currentRocket = 3;
  private _maxVolume = 0;
  private _currentVolume = 0;


  get maxVolume(): number {
    return this._maxVolume;
  }

  set maxVolume(value: number) {
    this._maxVolume = value;
  }

  get currentVolume(): number {
    return this._currentVolume;
  }

  set currentVolume(value: number) {
    this._currentVolume = value;
  }

  get maxRocket(): number {
    return this._maxRocket;
  }

  set maxRocket(value: number) {
    this._maxRocket = value;
  }

  get currentCargo(): number {
    return this._currentCargo;
  }

  set currentCargo(value: number) {
    this._currentCargo = value;
  }

  get currentRocket(): number {
    return this._currentRocket;
  }

  set currentRocket(value: number) {
    this._currentRocket = value;
  }

  get currentAccEnergy(): number {
    return this._currentAccEnergy;
  }

  set currentAccEnergy(value: number) {
    this._currentAccEnergy = value;
  }

  get currentAccShield(): number {
    return this._currentAccShield;
  }

  set currentAccShield(value: number) {
    this._currentAccShield = value;
  }

  get playerShip(): boolean {
    return this._playerShip;
  }

  set playerShip(value: boolean) {
    this._playerShip = value;
  }

  get equipments(): Map<any, any> {
    return this._equipments;
  }

  set equipments(value: Map<any, any>) {
    this._equipments = value;
  }

  get maxEnergy(): number {
    return this._maxEnergy;
  }

  set maxEnergy(value: number) {
    this._maxEnergy = value;
  }

  get currentEnergy(): number {
    return this._currentEnergy;
  }

  set currentEnergy(value: number) {
    this._currentEnergy = value;
  }

  get maxAccEnergy(): number {
    return this._maxAccEnergy;
  }

  set maxAccEnergy(value: number) {
    this._maxAccEnergy = value;
  }

  get maxCargo(): number {
    return this._maxCargo;
  }

  set maxCargo(value: number) {
    this._maxCargo = value;
  }

  get maxFuel(): number {
    return this._maxFuel;
  }

  set maxFuel(value: number) {
    this._maxFuel = value;
  }

  get currentFuel(): number {
    return this._currentFuel;
  }

  set currentFuel(value: number) {
    this._currentFuel = value;
  }

  get maxAccShield(): number {
    return this._maxAccShield;
  }

  set maxAccShield(value: number) {
    this._maxAccShield = value;
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
    this.installEquip(new Armor(1));
    this.installEquip(new Capacitor(1));
    this.installEquip(new Cargobay(2));
    this.installEquip(new Fueltank(1));
    this.installEquip(new Shield(1));
    this.installEquip(new Lasergun(1));
    this.installEquip(new Rocketlauncher(1));
    this.installEquip(new Engine(3));
  }

  draw(ctx: CanvasRenderingContext2D, point0: Point) {
    super.draw(ctx, point0);
  }

  installEquip(equipment: Equipment) {
    equipment.install(this, 1);
  }

  logic() {
    super.logic();
    let t = 0;
    // щит
    t = (this.currentShield + this.maxAccShield > this.maxShield) ? this.maxShield : this.currentShield + this.maxAccShield;
    this.currentShield = this.currentShield > 0 ? t : 0;
    // энергия
    t = (this.currentEnergy + this.maxAccEnergy > this.maxEnergy) ? this.maxEnergy : this.currentEnergy + this.maxAccEnergy;
    this.currentEnergy = this.currentEnergy > 0 ? t : 0;

    this.equipments.forEach(equipment => equipment.logic());
    if (!this.playerShip) {
      if (this.chekpoints.length === 0) {
        this.chekpoints.push(new Point(UtilService.getRandomInteger(100, 1000), UtilService.getRandomInteger(100, 1000)));
      }
    }
  }

  fireRocket() {
    if (this.equipments.has(Equip.ROCKETLAUNCHER)) {
      this.equipments.get(Equip.ROCKETLAUNCHER).fireRocket(this);
    }
  }

  fireLaser() {
    if (this.equipments.has(Equip.LASERGUN)) {
      this.equipments.get(Equip.LASERGUN).fireLaser(this);
    }
  }
}
