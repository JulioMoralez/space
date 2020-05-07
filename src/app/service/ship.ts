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
import {LogicRole} from './logicRole';
import {Goods} from './goods';
import {InventoryComponent} from '../inventory/inventory.component';

export enum Role {
  PLAYER, PATRUL, BATTLE, TRADER, CONVOY, PIRATE
}

export enum Fraction {
  TRADER, MINER, POLICE, PIRATE
}

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
  private _hyperjumpEnded = false;
  private currentJumpRadius = this.radius * 2;
  private currentJumpWidth = 1;
  private _battleMode = false;
  private _logicRole: LogicRole;
  private _fraction: Fraction;
  private maxMine = 100;
  private currentMine = 0;
  private mine = false;
  private mineTarget: Figure = null;
  private _goodsInBay: number[] = new Array(17).fill(0); // константное число количества товаров. Не хочу вводить сюда зависимость от Goods
  private _message = '';
  private _messageStyle = 0;
  private _newMessage = false;


  get newMessage(): boolean {
    return this._newMessage;
  }

  set newMessage(value: boolean) {
    this._newMessage = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }

  get messageStyle(): number {
    return this._messageStyle;
  }

  set messageStyle(value: number) {
    this._messageStyle = value;
  }

  get goodsInBay(): number[] {
    return this._goodsInBay;
  }

  set goodsInBay(value: number[]) {
    this._goodsInBay = value;
  }

  get fraction(): Fraction {
    return this._fraction;
  }

  set fraction(value: Fraction) {
    this._fraction = value;
  }

  get logicRole(): LogicRole {
    return this._logicRole;
  }

  set logicRole(value: LogicRole) {
    this._logicRole = value;
  }

  get battleMode(): boolean {
    return this._battleMode;
  }

  set battleMode(value: boolean) {
    this._battleMode = value;
  }

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


  get hyperjumpEnded(): boolean {
    return this._hyperjumpEnded;
  }

  constructor(type: number, point0: Point, figures: Figure[]) {
    super(point0);
    this.figures = figures;
    switch (type) {
      case 1: { // Cobra MK-3
        this.scale = 1;
        this.radius = 50 * this.scale;
        this.points.push(new Point(point0.x, point0.y - 40 * this.scale));
        this.points.push(new Point(point0.x, point0.y - 20 * this.scale));
        this.points.push(new Point(point0.x, point0.y));
        this.points.push(new Point(point0.x, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x + 20 * this.scale, point0.y - 20 * this.scale));
        this.points.push(new Point(point0.x + 50 * this.scale, point0.y + 20 * this.scale));
        this.points.push(new Point(point0.x + 50 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x + 40 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x - 20 * this.scale, point0.y - 20 * this.scale));
        this.points.push(new Point(point0.x - 50 * this.scale, point0.y + 20 * this.scale));
        this.points.push(new Point(point0.x - 50 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x - 40 * this.scale, point0.y + 30 * this.scale));
        this.setAxis(this.points[0], this.points[3]);
        const color = 'white';
        const width = 1;
        this.lines.push(new Line(0, 1, color, width));
        this.lines.push(new Line(2, 3, color, width));
        this.lines.push(new Line(2, 4, color, width));
        this.lines.push(new Line(2, 11, color, width));
        this.lines.push(new Line(2, 7, color, width));
        this.lines.push(new Line(2, 8, color, width));
        this.lines.push(new Line(4, 8, color, width));
        this.lines.push(new Line(4, 7, color, width));
        this.lines.push(new Line(4, 5, color, width));
        this.lines.push(new Line(8, 9, color, width));
        this.lines.push(new Line(8, 11, color, width));
        this.lines.push(new Line(9, 10, color, width));
        this.lines.push(new Line(9, 11, color, width));
        this.lines.push(new Line(5, 7, color, width));
        this.lines.push(new Line(5, 6, color, width));
        this.lines.push(new Line(6, 10, color, width));
        this.chooseEquip(1, 1, 4, 1, 1, 1, 1, 5);
        break;
      }
      case 2: { // Adder
        this.scale = 1;
        this.radius = 50 * this.scale;
        this.points.push(new Point(point0.x, point0.y - 40 * this.scale));
        this.points.push(new Point(point0.x, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x + 20 * this.scale, point0.y - 40 * this.scale));
        this.points.push(new Point(point0.x - 20 * this.scale, point0.y - 40 * this.scale));
        this.points.push(new Point(point0.x + 20 * this.scale, point0.y - 10 * this.scale));
        this.points.push(new Point(point0.x - 20 * this.scale, point0.y - 10 * this.scale));
        this.points.push(new Point(point0.x + 30 * this.scale, point0.y + 10 * this.scale));
        this.points.push(new Point(point0.x - 30 * this.scale, point0.y + 10 * this.scale));
        this.points.push(new Point(point0.x + 30 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x - 30 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x + 20 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x - 20 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x + 10 * this.scale, point0.y - 30 * this.scale));
        this.points.push(new Point(point0.x - 10 * this.scale, point0.y - 30 * this.scale));
        this.points.push(new Point(point0.x + 10 * this.scale, point0.y - 20 * this.scale));
        this.points.push(new Point(point0.x - 10 * this.scale, point0.y - 20 * this.scale));
        this.setAxis(this.points[0], this.points[1]);
        const color = 'white';
        const width = 1;
        this.lines.push(new Line(2, 10, color, width));
        this.lines.push(new Line(2, 3 , color, width));
        this.lines.push(new Line(3, 11, color, width));
        this.lines.push(new Line(4, 5, color, width));
        this.lines.push(new Line(6, 2, color, width));
        this.lines.push(new Line(6, 4, color, width));
        this.lines.push(new Line(6, 8, color, width));
        this.lines.push(new Line(7, 3, color, width));
        this.lines.push(new Line(7, 5, color, width));
        this.lines.push(new Line(7, 9, color, width));
        this.lines.push(new Line(8, 9, color, width));
        this.lines.push(new Line(12, 14, color, width));
        this.lines.push(new Line(14, 15, color, width));
        this.lines.push(new Line(15, 13, color, width));
        this.lines.push(new Line(13, 12, color, width));
        this.chooseEquip(1, 1, 1, 1, 1, 1, 1, 6);
        break;
      }
      case 3: { // Asp MK-2
        this.scale = 1;
        this.radius = 50 * this.scale;
        this.points.push(new Point(point0.x, point0.y - 40 * this.scale));
        this.points.push(new Point(point0.x, point0.y - 30 * this.scale));
        this.points.push(new Point(point0.x, point0.y + 10 * this.scale));
        this.points.push(new Point(point0.x, point0.y + 40 * this.scale));
        this.points.push(new Point(point0.x + 15 * this.scale, point0.y - 30 * this.scale));
        this.points.push(new Point(point0.x - 15 * this.scale, point0.y - 30 * this.scale));
        this.points.push(new Point(point0.x + 22 * this.scale, point0.y - 3 * this.scale));
        this.points.push(new Point(point0.x - 22 * this.scale, point0.y - 3 * this.scale));
        this.points.push(new Point(point0.x + 40 * this.scale, point0.y + 2 * this.scale));
        this.points.push(new Point(point0.x - 40 * this.scale, point0.y + 2 * this.scale));
        this.points.push(new Point(point0.x + 30 * this.scale, point0.y + 40 * this.scale));
        this.points.push(new Point(point0.x - 30 * this.scale, point0.y + 40 * this.scale));
        this.setAxis(this.points[0], this.points[3]);
        const color = 'white';
        const width = 1;
        this.lines.push(new Line(0, 1, color, width));
        this.lines.push(new Line(4, 5, color, width));
        this.lines.push(new Line(4, 8, color, width));
        this.lines.push(new Line(8, 10, color, width));
        this.lines.push(new Line(10, 11, color, width));
        this.lines.push(new Line(11, 9, color, width));
        this.lines.push(new Line(9, 5, color, width));
        this.lines.push(new Line(7, 5, color, width));
        this.lines.push(new Line(7, 9, color, width));
        this.lines.push(new Line(6, 4, color, width));
        this.lines.push(new Line(6, 8, color, width));
        this.lines.push(new Line(2, 3, color, width));
        this.lines.push(new Line(2, 6, color, width));
        this.lines.push(new Line(2, 7, color, width));
        this.chooseEquip(1, 1, 1, 1, 1, 1, 1, 1);
        break;
      }
      case 4: { // Krait
        this.scale = 1;
        this.radius = 50 * this.scale;
        this.points.push(new Point(point0.x, point0.y - 25 * this.scale));
        this.points.push(new Point(point0.x, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x + 35 * this.scale, point0.y - 25 * this.scale));
        this.points.push(new Point(point0.x - 35 * this.scale, point0.y - 25 * this.scale));
        this.points.push(new Point(point0.x + 35 * this.scale, point0.y + 10 * this.scale));
        this.points.push(new Point(point0.x - 35 * this.scale, point0.y + 10 * this.scale));
        this.points.push(new Point(point0.x, point0.y - 8 * this.scale));
        this.points.push(new Point(point0.x + 10 * this.scale, point0.y + 7 * this.scale));
        this.points.push(new Point(point0.x, point0.y + 2 * this.scale));
        this.points.push(new Point(point0.x - 10 * this.scale, point0.y + 7 * this.scale));
        this.setAxis(this.points[0], this.points[1]);
        const color = 'white';
        const width = 1;
        this.lines.push(new Line(0, 6, color, width));
        this.lines.push(new Line(8, 1, color, width));
        this.lines.push(new Line(0, 4, color, width));
        this.lines.push(new Line(4, 1, color, width));
        this.lines.push(new Line(1, 5, color, width));
        this.lines.push(new Line(5, 0, color, width));
        this.lines.push(new Line(3, 5, color, width));
        this.lines.push(new Line(2, 4, color, width));
        this.lines.push(new Line(6, 7, color, width));
        this.lines.push(new Line(7, 8, color, width));
        this.lines.push(new Line(8, 9, color, width));
        this.lines.push(new Line(9, 6, color, width));
        this.chooseEquip(1, 1, 1, 1, 1, 1, 1, 1);
        break;
      }
      case 5: { // Python
        this.scale = 1;
        this.radius = 50 * this.scale;
        this.points.push(new Point(point0.x, point0.y - 60 * this.scale));
        this.points.push(new Point(point0.x, point0.y + 40 * this.scale));
        this.points.push(new Point(point0.x + 25 * this.scale, point0.y + 10 * this.scale));
        this.points.push(new Point(point0.x - 25 * this.scale, point0.y + 10 * this.scale));
        this.points.push(new Point(point0.x + 15 * this.scale, point0.y + 40 * this.scale));
        this.points.push(new Point(point0.x - 15 * this.scale, point0.y + 40 * this.scale));
        this.points.push(new Point(point0.x, point0.y - 5 * this.scale));
        this.setAxis(this.points[0], this.points[1]);
        const color = 'white';
        const width = 1;
        this.lines.push(new Line(0, 1, color, width));
        this.lines.push(new Line(0, 2, color, width));
        this.lines.push(new Line(2, 4, color, width));
        this.lines.push(new Line(4, 5, color, width));
        this.lines.push(new Line(5, 3, color, width));
        this.lines.push(new Line(3, 0, color, width));
        this.lines.push(new Line(2, 3, color, width));
        this.lines.push(new Line(6, 2, color, width));
        this.lines.push(new Line(2, 1, color, width));
        this.lines.push(new Line(1, 3, color, width));
        this.lines.push(new Line(3, 6, color, width));
        this.chooseEquip(1, 1, 1, 1, 1, 1, 1, 1);
        break;
      }
      case 6: { // Viper
        this.scale = 1;
        this.radius = 50 * this.scale;
        this.points.push(new Point(point0.x, point0.y - 35 * this.scale));
        this.points.push(new Point(point0.x, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x + 35 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x - 35 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x - 18 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x + 18 * this.scale, point0.y + 30 * this.scale));
        this.points.push(new Point(point0.x, point0.y - 5 * this.scale));
        this.setAxis(this.points[0], this.points[1]);
        const color = 'white';
        const width = 1;
        this.lines.push(new Line(0, 2, color, width));
        this.lines.push(new Line(2, 3, color, width));
        this.lines.push(new Line(3, 0, color, width));
        this.lines.push(new Line(0, 6, color, width));
        this.lines.push(new Line(6, 4, color, width));
        this.lines.push(new Line(6, 5, color, width));
        this.chooseEquip(1, 1, 1, 1, 1, 1, 1, 1);
        break;
      }
      case 7: { // Fer-de-Lance
        this.scale = 1;
        this.radius = 50 * this.scale;
        this.points.push(new Point(point0.x, point0.y - 60 * this.scale));
        this.points.push(new Point(point0.x, point0.y + 40 * this.scale));
        this.points.push(new Point(point0.x + 25 * this.scale, point0.y + 10 * this.scale));
        this.points.push(new Point(point0.x - 25 * this.scale, point0.y + 10 * this.scale));
        this.points.push(new Point(point0.x + 10 * this.scale, point0.y + 40 * this.scale));
        this.points.push(new Point(point0.x - 10 * this.scale, point0.y + 40 * this.scale));
        this.points.push(new Point(point0.x + 15 * this.scale, point0.y - 20 * this.scale));
        this.points.push(new Point(point0.x - 15 * this.scale, point0.y - 20 * this.scale));
        this.points.push(new Point(point0.x + 10 * this.scale, point0.y - 10 * this.scale));
        this.points.push(new Point(point0.x - 10 * this.scale, point0.y - 10 * this.scale));
        this.points.push(new Point(point0.x, point0.y));
        this.setAxis(this.points[0], this.points[1]);
        const color = 'white';
        const width = 1;
        this.lines.push(new Line(0, 6, color, width));
        this.lines.push(new Line(6, 2, color, width));
        this.lines.push(new Line(2, 4, color, width));
        this.lines.push(new Line(4, 5, color, width));
        this.lines.push(new Line(5, 3, color, width));
        this.lines.push(new Line(3, 7, color, width));
        this.lines.push(new Line(7, 0, color, width));
        this.lines.push(new Line(10, 2, color, width));
        this.lines.push(new Line(10, 4, color, width));
        this.lines.push(new Line(10, 5, color, width));
        this.lines.push(new Line(10, 3, color, width));
        this.lines.push(new Line(9, 7, color, width));
        this.lines.push(new Line(9, 0, color, width));
        this.lines.push(new Line(8, 6, color, width));
        this.lines.push(new Line(8, 0, color, width));
        this.chooseEquip(1, 1, 1, 1, 1, 1, 1, 1);
        break;
      }
    }
  }

  chooseEquip(armor: number, capacitor: number, cargobay: number, fueltank: number,
              lasergun: number, rocketlauncher: number, shield: number, engine: number) {
    this.installEquip(new Armor(armor));
    this.installEquip(new Capacitor(capacitor));
    this.installEquip(new Cargobay(cargobay));
    this.installEquip(new Fueltank(fueltank));
    this.installEquip(new Lasergun(lasergun));
    this.installEquip(new Rocketlauncher(rocketlauncher));
    this.installEquip(new Shield(shield));
    this.installEquip(new Engine(engine));
  }

  draw(ctx: CanvasRenderingContext2D, point0: Point) {
    super.draw(ctx, point0);
    if (this.state === State.JUMP) { // оисуем анимацию прыжка
      ctx.beginPath();
      ctx.lineWidth = this.currentJumpWidth;
      ctx.strokeStyle = 'black';
      ctx.arc(this.point0.x  + point0.x, this.point0.y  + point0.y, this.currentJumpRadius,  0, 2 * Math.PI);
      ctx.stroke();
      if (this.currentJumpRadius - 0.9 >= 0) {
        this.currentJumpRadius -= 0.9;
        this.currentJumpWidth += 2;
      } else {
        this.state = State.IDLE;
        this._hyperjumpEnded = true;
      }
    }
    if (this.mine) {
      // шкала действий, копаем руду
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.fillStyle = '#0F0';
      ctx.strokeStyle = '#DDD';
      ctx.rect(this.point0.x - this.radius + point0.x, this.point0.y - this.radius * 1.7 - 12   + point0.y,
        2 * this.radius * this.currentMine / this.maxMine, 5);
      ctx.stroke();
      ctx.fill();
    }

  }

  installEquip(equipment: Equipment) {
    equipment.install(this, 1);
  }

  logic() {
    super.logic();
    this.logicRole.useRole();
    if ((this._battleMode === true) && (this.target !== null) && (this.target.state !== State.DOCK)) {
      this.fireLaser();
    }
    let t = 0;
    // щит
    t = (this.currentShield + this.maxAccShield > this.maxShield) ? this.maxShield : this.currentShield + this.maxAccShield;
    this.currentShield = t > 0 ? t : 0;
    // энергия
    t = (this.currentEnergy + this.maxAccEnergy > this.maxEnergy) ? this.maxEnergy : this.currentEnergy + this.maxAccEnergy;
    this.currentEnergy = t > 0 ? t : 0;
    if (this.mine) {
      if (this.mineInRadius()) {
        this.currentMine++;
        if (this.currentMine > this.maxMine) {
          this.currentMine = 0;
          if (this.currentVolume < this.maxVolume) {
            this.currentVolume++;
            this._goodsInBay[Goods.MINERALS.id]++;
            this.sms('Получен предмет ' + Goods.MINERALS.name, 0);
          } else {
            this.sms('Грузовой отсек заполнен', 1);
          }
        }
      } else {
        this.mine = null;
        this.currentMine = 0;
      }
    }

    this.equipments.forEach(equipment => equipment.logic());
    // if (!this.playerShip) {
    //   if (this.chekpoints.length === 0) {
    //     this.chekpoints.push(new Point(UtilService.getRandomInteger(100, 1000), UtilService.getRandomInteger(100, 1000)));
    //   }
    // }
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

  toBattleMode(launcher: Figure) { // отвечаем атакующему
    if (this.logicRole.role !== Role.BATTLE) {
      this.logicRole.newRole(Role.BATTLE, launcher);
    }
  }

  hyperjumpStartAnim() {
    this.target = null;
    this.chekpoints.length = 0;
    this.state = State.JUMP;
  }

  hyperjumpCancel() {
    this.state = State.IDLE;
    this.currentJumpRadius = this.radius * 2;
    this.currentJumpWidth = 1;
  }

  hyperjump(hyperjumpDistance: number, point0: Point, maxAreaX: number, maxAreaY: number, maxMapX: number, maxMapY: number) {
    this._hyperjumpEnded = false;
    this.currentFuel -= hyperjumpDistance;
    let newX = 0;
    let newY = 0;
    let rot = 0;
    switch (UtilService.getRandomInteger(0, 3)) {
      case 0: {
        newX = 300 - this.point0.x;
        newY = 300 - this.point0.y;
        rot = 135;
        point0.x = 0;
        point0.y = 0;
        break;
      }
      case 1: {
        newX = maxMapX - 300 - this.point0.x;
        newY = 300 - this.point0.y;
        rot = -135;
        point0.x = - maxMapX + maxAreaX;
        point0.y = 0;
        break;
      }
      case 2: {
        newX = maxMapX - 400 - this.point0.x;
        newY = maxMapY - 400 - this.point0.y;
        rot = -45;
        point0.x = - maxMapX + maxAreaX;
        point0.y = - maxMapY + maxAreaY;
        break;
      }
      case 3: {
        newX = 300 - this.point0.x;
        newY = maxMapY - 300 - this.point0.y;
        rot = 45;
        point0.x = 0;
        point0.y = - maxMapY + maxAreaY;
        break;
      }
    }
    for (const point of this.points) {
      point.x += newX;
      point.y += newY;
    }
    this.point0.x += newX;
    this.point0.y += newY;
    this.povorot( -this.angle + rot);
  }

  doMine() {
    this.mine = true;
    this.mineTarget = this.target;
  }

  mineInRadius(): boolean { // проверка, находимся ли рядом с астероидами
    if (this.mine) { // если уже копаем, то контролируем имеено по этому объекту, откуда копаем
      if (this.mineTarget !== null) {
        return UtilService.inRadius(this.point0, this.mineTarget.point0, this.mineTarget.radius);
      } else {
        return false;
      }
    } else {
      if (this.target !== null) {
        return UtilService.inRadius(this.point0, this.target.point0, this.target.radius);
      } else {
        return false;
      }
    }
  }

  undock() {
    this.currentSpeed = this.maxSpeed;
    this.chekpoints.length = 0;
    for (const point of this.points) {
      point.x += (this.point0.x - this.pointBeforeDock.x);
      point.y += (this.point0.y - this.pointBeforeDock.y);
    }
    this.pointBeforeDock.x = 0;
    this.pointBeforeDock.y = 0;
    this.onDock = null;
    this.currentShield = this.maxShield;
    this.state = State.IDLE;
    this.message = '';
  }

  sms(message: string, style: number) {
    this.message = message;
    this.messageStyle = style;
    this.newMessage = true;
  }
}
