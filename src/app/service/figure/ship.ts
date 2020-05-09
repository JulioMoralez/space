import {Figure, State} from './figure';
import {UtilService} from '../util.service';
import {Point} from '../point';
import {Line} from '../line';
import {Shield} from '../equipment/shield';
import {Capacitor} from '../equipment/capacitor';
import {Lasergun} from '../equipment/lasergun';
import {Rocketlauncher} from '../equipment/rocketlauncher';
import {Equip, Equipment} from '../equipment/equipment';
import {Armor} from '../equipment/armor';
import {Cargobay} from '../equipment/cargobay';
import {Fueltank} from '../equipment/fueltank';
import {Engine} from '../equipment/engine';
import {LogicRole} from '../logicRole';
import {Goods} from '../goods';
import {Cont} from './cont';

export enum Role {
  PLAYER, PATRUL, BATTLE, TRADER, CONVOY, PIRATE, NONE, BORDER
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
  private _maxRocket = 1;
  private _currentRocket = 1;
  private _maxVolume = 0;
  private _currentVolume = 0;
  private _hyperjumpEnded = false;
  private currentJumpRadius = this.radius * 2;
  private currentJumpWidth = 1;
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
  private take = false;
  private takeTarget: Figure = null;
  private _battleTarget: Figure = null;
  private _takeRadius = this.radius * 7;


  get battleTarget(): Figure {
    return this._battleTarget;
  }

  set battleTarget(value: Figure) {
    this._battleTarget = value;
  }

  get takeRadius(): number {
    return this._takeRadius;
  }

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
      case 1: {
        this.name = 'Cobra MK-3';
        this.info = 'Корабль оснащен генераторами кормового и носового защитных полей. ' +
          'Боевые надстройки позволяют размещать до четырех пусковых установок ракет. ' +
          'Наиболее популярен среди независимых торговцев, желающих совместить боевую мощь с приличной грузоподъемностью.';
        this.maxRocket = 4;
        this.currentRocket = 3;
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
        this.chooseEquip(1, 1, 4, 1, 1, 1, 2, 5);
        break;
      }
      case 2: {
        this.name = 'Asp MK-2';
        this.info = 'Основная боевая единица Галактического Флота. ' +
          'Корабль разработан и изготавливается на государственных заводах. ' +
          'Имеет уникальную систему камуфлирования под окружающую обстановку. ' +
          'Предназначен для проведения разведывательных операций и сопровождения караванов. ' +
          'Прекрасная маневренность, высокая скорость, мощный лазер ' +
          'делают его желанным (но и труднодоступным) объектом для захвата пиратами. ' +
          'Большие габариты позволяют нести мощные установки генерации силовых полей.';
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
      case 3: {
        this.name = 'Viper';
        this.info = 'Малый, надежный, высокоманевренный истребитель-перехватчик. ' +
          'Изготовлен по заказу полицейских сил для патрулирования. ' +
          'Используется также и Вооруженными Силами в операциях по сопровождению караванов. ' +
          'Истребитель одноместный, но, при необходимости, в нем кратковременно можно разместить до 10 пассажиров. ' +
          'Грузового отсека не имеет.';
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
      case 4: {
        this.name = 'Fer-de-Lance';
        this.info = 'Корабль наиболее широко используется состоятельными охотниками за призами и независимыми компаниями в деловых операциях. ' +
          'Изысканный корабль, пригодный как для деловых вояжей бизнесменов, так и для боевого применения и для комфортабельного отдыха. ' +
          'В ущерб грузоподъемности оснащен наиболее совершенным навигационным оборудованием, системами защиты и нападения. ' +
          'Внутренняя отделка выполнена из самых дорогих материалов. Корабль полностью автономен.';
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
      case 5: {
        this.name = 'Python';
        this.info = 'Один из самых крупных торговых кораблей. ' +
          'Малая скорость и плохая маневренность компенсируется мощнейшими установками защитных полей и мощным лазером. ' +
          'Редко подвергается атакам пиратских кораблей и широко используется ' +
          'свободными предпринимателями в качестве временного склада в челночных операциях и как промежуточная база отдыха.';
        this.scale = 1;
        this.radius = 50 * this.scale;
        this.points.push(new Point(point0.x, point0.y - 65 * this.scale));
        this.points.push(new Point(point0.x, point0.y + 60 * this.scale));
        this.points.push(new Point(point0.x + 30 * this.scale, point0.y + 18 * this.scale));
        this.points.push(new Point(point0.x - 30 * this.scale, point0.y + 18 * this.scale));
        this.points.push(new Point(point0.x + 15 * this.scale, point0.y + 60 * this.scale));
        this.points.push(new Point(point0.x - 15 * this.scale, point0.y + 60 * this.scale));
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
      }case 6: {
        this.name = 'Krait';
        this.info = 'Небольшой, надежный одноместный истребитель. ' +
          'В последние годы был вытеснен более совершенными кораблями, но в отдаленных секторах космоса он все еще встречается. ' +
          'Запасные части давно не выпускаются и пилоты нередко добывают их посредством пиратства.';
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
      case 7: {
        this.name = 'Adder';
        this.info = 'Корабль разработан и выпускается компанией, работающей без лицензии. ' +
          'Местоположение ее штаб-квартиры неизвестно. ' +
          'Используется в основном контрабандистами. Вооружение слабое — несет только одну пусковую ракетную установку.';
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
    if (this.take) { // если притягиваем контейнер к себеша
      if (this.takeTarget !== null) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0F0';
        ctx.moveTo(this.point0.x + point0.x, this.point0.y + point0.y);
        ctx.lineTo(this.takeTarget.point0.x + point0.x, this.takeTarget.point0.y + point0.y);
        ctx.stroke();
      }
    }

  }

  installEquip(equipment: Equipment) {
    equipment.install(this, 1);
  }

  logic() {
    super.logic();
    if ((this.state === State.DEAD) && (this.logicRole.role !== Role.BORDER)) { // в случае своей гибели оставляем контейнер
      this.createCont();
    }
    this.logicRole.useRole();
    if ((this.battleMode === true) && (this.battleTarget !== null) && (this.battleTarget.state !== State.DOCK)) {
      this.fireLaser();
    }
    let t: number;
    // щит
    t = (this.currentShield + this.maxAccShield > this.maxShield) ? this.maxShield : this.currentShield + this.maxAccShield;
    this.currentShield = t > 0 ? t : 0;
    // энергия
    t = (this.currentEnergy + this.maxAccEnergy > this.maxEnergy) ? this.maxEnergy : this.currentEnergy + this.maxAccEnergy;
    this.currentEnergy = t > 0 ? t : 0;
    if (this.mine) {
      if ((this.mineInRadius()) && (this.battleMode === false))  {
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
        this.mine = false;
        this.mineTarget = null;
        this.currentMine = 0;
      }
    }
    if (this.take) {
      if ((this.contInRadius(this.takeRadius)) && (this.takeTarget !== null)) {
        this.takeTarget.moveToFigure(this); // двигаем к себе контейнер
        if (this.contInRadius(this.takeTarget.radius)) {
            if (this.currentVolume < this.maxVolume) {
              const cont = this.takeTarget as Cont;
              if ((this.currentVolume + cont.volume) > this.maxVolume) {
                cont.volume = this.maxVolume - this.currentVolume;
              }
              this.currentVolume += cont.volume;
              this._goodsInBay[cont.good.id] += cont.volume;
              this.sms('Получен предмет ' + cont.good.name + ' в количестве ' + cont.volume, 0);
              this.takeTarget.state = State.DEAD;
              this.figures.splice(this.figures.indexOf(this.takeTarget), 1);
            } else {
              this.sms('Грузовой отсек заполнен', 1);
            }
            this.take = false;
            this.takeTarget = null;
        }
      } else {
        this.take = false;
        this.takeTarget = null;
      }
    }

    this.equipments.forEach(equipment => equipment.logic());
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
    if ((this.logicRole.role !== Role.BATTLE) && (this.logicRole.role !== Role.PLAYER)) {
      this.logicRole.newRole(Role.BATTLE, launcher);
    }
  }

  hyperjumpStartAnim() {
    this.target = null;
    this.chekpoints.length = 0;
    this.currentJumpRadius = this.radius * 2;
    this.currentJumpWidth = 1;
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
    if (this.mineInRadius()) {
      this.mine = true;
      this.mineTarget = this.target;
      this.sms('Начата добыча ресурсов', 0);
    } else {
      this.sms('Вы находитесь вне радиуса добычи ресурсов', 1);
    }

  }

  mineInRadius(): boolean { // проверка, находимся ли рядом с астероидами
    let t: Figure;
    if (this.mine) { // если уже копаем, то контролируем имеено по этому объекту, откуда копаем
      t = this.mineTarget;
    } else {
      t = this.target;
    }
    if (t !== null) {
      return UtilService.inRadius(this.point0, t.point0, t.radius);
    } else {
      return false;
    }
  }

  doTake() {
    if (this.contInRadius(this.takeRadius)) {
      this.take = true;
      this.takeTarget = this.target;
      this.sms('Контейнер захвачен гравитационным лучем', 0);
    } else {
      this.sms('Контейнер за пределами действия гравитационного луча', 1);
    }
  }

  contInRadius(radius: number): boolean { // проверка, находимся ли рядом с контейнером в космосе
    let t: Figure;
    if (this.take) { // если уже тянем, то контролируем имеено по этому объекту
      t = this.takeTarget;
    } else {
      t = this.target;
    }
    if (t !== null) {
      return UtilService.inRadius(this.point0, t.point0, radius);
    } else {
      return false;
    }
  }

  dock() {
    this.dockingTarget = this.target;
    this.moveToTarget(State.DOCKING);
    this.sms('Стыкуемся с объектом ' + this.dockingTarget.name, 0);
  }

  undock() {
    this.dockingTarget = null;
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

  private createCont() {
    let good: Goods;
    let volume: number;
    const r = UtilService.getRandomInteger(0, 10);
    if (r <= 5) {
      good = Goods.ALLOYS;
      volume = UtilService.getRandomInteger(1, 4);
    } else {
      if (r <= 8) {
        good = Goods.SLAVES;
        volume = UtilService.getRandomInteger(1, 4);
      } else {
        if (r === 9) {
          good = Goods.NARCOTICS;
          volume = UtilService.getRandomInteger(1, 2);
        } else {
          good = Goods.PLATINUM;
          volume = UtilService.getRandomInteger(1, 2);
        }
      }
    }
    this.figures.push(new Cont(new Point(this.point0.x, this.point0.y), this.figures, good, volume));
  }

  allReset() { // сброс все текущих действий
    this.resetTarget();
    this.hyperjumpCancel();
    this.mine = false;
    this.mineTarget = null;
    this.take = false;
    this.takeTarget = null;
  }
}
