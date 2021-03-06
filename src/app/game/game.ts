import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {UtilService} from '../service/util.service';
import {Star} from '../service/star';
import {Figure, State} from '../service/figure/figure';
import {Point} from '../service/point';
import {Joy} from '../service/joy';
import {Fraction, Role, Ship} from '../service/figure/ship';
import {QuickMenu} from '../service/quickMenu';
import {Equip, Equipment} from '../service/equipment/equipment';
import {Starmap} from '../service/starmap';
import {Solar} from '../service/solar';
import {Goods} from '../service/goods';
import {Armor} from '../service/equipment/armor';
import {Shield} from '../service/equipment/shield';
import {Capacitor} from '../service/equipment/capacitor';
import {Cargobay} from '../service/equipment/cargobay';
import {Fueltank} from '../service/equipment/fueltank';
import {Lasergun} from '../service/equipment/lasergun';
import {Rocketlauncher} from '../service/equipment/rocketlauncher';
import {Engine} from '../service/equipment/engine';
import {Container} from '../service/equipment/container';
import {LogicRole} from '../service/logicRole';
import {Scheduler} from '../service/scheduler';
import {Orb, TypeOrb} from '../service/figure/orb';
import {Cont} from '../service/figure/cont';
import {User, UserService} from '../service/user.service';
import {GameDTO, GameService} from '../service/game.service';

export enum Trade {
  NONE, SHIP, INVENTORY, MARKET
}

export enum Menu {
  TARGET, INVENTORY, MAP, TRADE, HELP
}

export class SearchField {
  name: string;
  techLevel: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {


  constructor(public userService: UserService, public gameService: GameService) { }

  @ViewChild('canvas123', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  stars: Star[] = [];
  globalCount = 0;
  private sub: Subscription = null;
  countStars = 100;
  startSystem = 0;
  currentSystem = this.startSystem;
  maxAreaX = 1300;
  maxAreaY = 920;
  maxMapX = this.maxAreaX * 3;
  maxMapY = this.maxAreaY * 3;
  borderMap = 50; // толщина границы карты
  menuX = 300;
  menuY = 400;
  maxStarmapX = this.maxAreaX - 2 * this.borderMap - this.menuX;
  maxStarmapY =  this.maxAreaY - 2 * this.borderMap;
  borderMinimap = 10;
  minimapXY = this.menuX - 2 * this.borderMinimap;
  visibleAreaOnMinimapX = this.maxAreaX * this.minimapXY / this.maxMapX;
  visibleAreaOnMinimapY = this.maxAreaY * this.minimapXY / this.maxMapY;
  point0 = new Point(0, 0); // глобальная точка отсчёта карты
  figures: Figure[] = [];
  helpFigures: Figure[] = [];
  helpPoint0 = new Point(100, 100);
  helpTarget: Figure = null;
  helpFigureStep = 130;
  joy = new Joy(new Point(this.maxAreaX - 150, this.maxAreaY - 150),
                new Point(0, 0),
                new Point(this.maxMapX - this.maxAreaX, this.maxMapY - this.maxAreaY));
  quickMenu = new QuickMenu();
  menu = Menu.TARGET;
  playerShip: Ship = null;
  public inventory: Equipment[] = [];
  emptyEquipment: Equipment = new Equipment();
  public trade = Trade.NONE;
  public credits = 100;
  solars: Solar[] = [];
  starmap: Starmap = null;
  searchField: SearchField = new SearchField();
  goods: Goods[] = [Goods.FOOD, Goods.TEXTILES, Goods.RADIOACTIVES, Goods.SLAVES, Goods.LIQUOR_WINES, Goods.LUXURIES, Goods.NARCOTICS,
                    Goods.COMPUTERS, Goods.MACHINERY, Goods.ALLOYS, Goods.FIREARMS, Goods.FURS,
                    Goods.MINERALS, Goods.GOLD, Goods.PLATINUM, Goods.GEMSTONES, Goods.ALIEN_ITEMS];
  scheduler: Scheduler = null;
  messageStyle = '';
  message = '';
  messageWithRepeat = '';
  messageRepeatCount = 0;
  messageSuccess = 'alert alert-success';
  messageDanger = 'alert alert-danger';
  users: User[];
  needSave = true;

  ngOnInit(): void {
    this.userService.getEs().subscribe(value => {
      this.users = value;
    });
    const id = sessionStorage.getItem('id');
    if (id !== null) {
      this.userService.getE(id.toString()).subscribe(value => {
        this.userService.user = value;
        this.newGame();
      });
    }
    this.initGameObjects();
    this.start();
  }

  start() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    if (this.sub !== null) {
      this.sub.unsubscribe();
    }
    this.sub = interval(33).subscribe(() => {
      this.globalCount++;
      for (let i = 0; i < this.countStars; i++) {
        this.stars[i].y += this.stars[i].dy;
        if (this.stars[i].y > this.maxAreaY) {
          this.stars[i].x = UtilService.getRandomInteger(0, this.maxAreaX);
          this.stars[i].y = 0;
        }
      }
      this.joy.shiftPoint(this.point0);

      for (const figure of this.figures) {
        figure.logic();
        figure.moveToCheckpoint(this.maxMapX, this.maxMapY);
        figure.moveOnEllipse();
      }
      if (this.playerShip !== null) {
        if (this.playerShip.hyperjumpEnded === true) {  // ждём окончания анимации гиперперехода и выполняем его, костыль конечно здесь это
          this.hyperjump();
        }
        if ((this.playerShip.state === State.DOCK) && ((this.playerShip.onDock as Orb).goodsPriceOnPlanet.length === 0)) {
          this.createPriceGoods(this.playerShip.onDock as Orb);  // генерируем цены на товары при приземлении
          this.createMarket(this.solars[this.currentSystem], this.playerShip.onDock as Orb); // генерируем товары на планете
        }
        if ((this.playerShip.state !== State.DOCK) && (this.playerShip.message.length > 0) && (this.playerShip.newMessage)) {
          this.sms(this.playerShip.message, this.playerShip.messageStyle);
          this.playerShip.newMessage = false;
        }
        if ((this.playerShip.state === State.DOCK) && (this.needSave === true)) {
          this.needSave = false;
          this.saveGame();
        }
        if (this.playerShip.state === State.DEAD) {
          this.rebirth();
        }
      }
      this.scheduler.schedule();
      this.refreshCanvas();
    });

  }

  sms(message: string, style: number) { // функция сообщений с подсчётом повторов
      if (this.message === message) {
        this.messageRepeatCount++;
      } else {
        this.messageRepeatCount = 0;
      }
      this.message = message;
      if (this.messageRepeatCount > 0) {
        this.messageWithRepeat = (this.message + ' (' + (this.messageRepeatCount + 1) + ')');
      } else {
        this.messageWithRepeat = this.message;
      }
      if (style === 0) {
        this.messageStyle = this.messageSuccess;
      } else {
        this.messageStyle = this.messageDanger;
      }
  }

  private refreshCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // граница карты
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'red';
    this.ctx.moveTo(this.borderMap + this.point0.x, this.borderMap + this.point0.y);
    this.ctx.lineTo(this.maxMapX - this.borderMap + this.point0.x, this.borderMap + this.point0.y);
    this.ctx.lineTo(this.maxMapX - this.borderMap + this.point0.x, this.maxMapY - this.borderMap + this.point0.y);
    this.ctx.lineTo(this.borderMap + this.point0.x, this.maxMapY - this.borderMap + this.point0.y);
    this.ctx.lineTo(this.borderMap + this.point0.x, this.borderMap + this.point0.y);
    this.ctx.stroke();
    // звезды
    this.ctx.fillStyle = 'yellow';
    for (let i = 0; i < this.countStars; i++) {
      this.stars[i].draw(this.ctx);
    }
    // объекты
    // this.planetLayers.length = 0;
    // for (let i = 0; i < this.figures.length; i++) {
    //   if (this.figures[i] instanceof Orb) {
    //     if (Math.abs((this.figures[i] as Orb).deg) > 180) {
    //       this.planetLayers.push(i);
    //     } else {
    //       this.planetLayers.unshift(i);
    //     }
    //     console.log((this.figures[i] as Orb).deg, this.planetLayers);
    //   }
    // }

    // from(this.planetLayers).subscribe(value => this.figures[value].draw(this.ctx, this.point0));
    for (const figure of this.figures) {
      figure.draw(this.ctx, this.point0);
    }

    // быстрое меню
    this.quickMenu.draw(this.ctx, this.point0);

    // интерфейс меню
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#17a2b8';
    this.ctx.fillStyle = 'black';
    this.ctx.rect(this.maxAreaX - this.menuX, this.maxAreaY - this.menuY, this.maxAreaX, this.maxAreaY);
    this.ctx.fill();
    this.ctx.stroke();

    // корабль игрока
    // щит, броня, энергия
    const scaleX = this.maxAreaX - this.menuX + 30;
    const scaleY = this.maxAreaY - this.minimapXY + -100;
    const maxScale = this.menuX - 60;
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#17a2b8';
    this.ctx.beginPath();
    this.ctx.rect(scaleX, scaleY, maxScale, 12);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.rect(scaleX, scaleY + 20, maxScale, 12);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.rect(scaleX, scaleY + 40, maxScale, 12);
    this.ctx.stroke();
    if (this.playerShip !== null) {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'yellow';
      this.ctx.rect(scaleX, scaleY, maxScale * this.playerShip.currentEnergy / this.playerShip.maxEnergy, 12);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.rect(scaleX, scaleY + 20, maxScale * this.playerShip.currentShield / this.playerShip.maxShield, 12);
      this.ctx.fillStyle = '#00F';
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.rect(scaleX, scaleY + 40, maxScale * this.playerShip.currentHp / this.playerShip.maxHp, 12);
      this.ctx.fillStyle = '#F00';
      this.ctx.fill();
      // ракеты в запасе
      for (let i = 0; i < this.playerShip.currentRocket; i++) {
        this.ctx.beginPath();
        this.ctx.rect(scaleX + i * 20, scaleY + 60, 12, 12);
        this.ctx.fillStyle = '#00F';
        this.ctx.fill();
      }
    }


    // видимая область на миникарте
    this.ctx.beginPath();
    this.ctx.fillStyle = '#222';
    this.ctx.rect(-this.point0.x * this.minimapXY / this.maxMapX + this.maxAreaX - this.menuX + this.borderMinimap,
                  -this.point0.y * this.minimapXY / this.maxMapY + this.maxAreaY - this.minimapXY - this.borderMinimap,
                  this.visibleAreaOnMinimapX, this.visibleAreaOnMinimapY);
    this.ctx.fill();

    // джойстик
    this.joy.draw(this.ctx);

    // объекты на миникарте
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#17a2b8';
    this.ctx.rect(this.maxAreaX  - this.menuX + this.borderMinimap,
                  this.maxAreaY  - this.minimapXY - this.borderMinimap, this.minimapXY , this.minimapXY);
    this.ctx.stroke();
    for (const figure of this.figures) {
      this.drawOnMiniMap(figure);
    }
    if (this.menu === Menu.HELP) { // рисуем справку
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'orange';
      this.ctx.fillStyle = '#111';
      this.ctx.fillRect(this.helpPoint0.x + this.helpFigureStep, this.helpPoint0.y,
        this.helpFigureStep * this.helpFigures.length + (this.helpFigureStep / 2), 170);
      this.ctx.stroke();
      for (const figure of this.helpFigures) {
        figure.draw(this.ctx, this.helpPoint0);
        if (figure === this.helpTarget) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = 'orange';
          this.ctx.arc(figure.point0.x + this.helpPoint0.x, figure.point0.y + this.helpPoint0.y, figure.radius * 1.3,  0, 2 * Math.PI);
          this.ctx.stroke();
        }
      }
    }
    if (this.menu === Menu.MAP) { // рисуем карту галактики
      this.starmap.draw(this.ctx, this.currentSystem, this.playerShip.currentFuel, this.searchField);
    }
  }

  drawOnMiniMap(figure: Figure) {
    if (figure instanceof Cont) { // не рисуем контейнеры на миникарте
      return;
    }
    const x = figure.point0.x * this.minimapXY / this.maxMapX + this.maxAreaX  - this.menuX + this.borderMinimap - 2;
    const y = figure.point0.y * this.minimapXY / this.maxMapY + this.maxAreaY - this.minimapXY - this.borderMinimap - 2;
    if ((x > (this.maxAreaX - this.menuX + this.borderMinimap - 2)) &&
        (x < (this.maxAreaX - this.borderMinimap - 2)) &&
        (y > (this.maxAreaY - this.minimapXY - this.borderMinimap)) &&
        (y < (this.maxAreaY - this.borderMinimap))) {
      this.ctx.beginPath();
      if (figure instanceof Orb) {
        this.ctx.fillStyle = 'red';
      } else {
        this.ctx.fillStyle = 'yellow';
      }
      if (figure === this.playerShip) {
        this.ctx.fillStyle = 'green';
      }
      this.ctx.fillRect(x, y, 4 , 4);
      this.ctx.fill();
    }
  }


  private initGameObjects() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    for (let i = 0; i < this.countStars; i++) {
      this.stars.push(
        new Star(UtilService.getRandomInteger(0, this.maxAreaX), UtilService.getRandomInteger(0, this.maxAreaY), i));
    }

    this.solars = Solar.generate(256, this.maxMapX, this.maxMapY, this.maxStarmapX, this.maxStarmapY, this.goods);
    this.starmap =
      new Starmap(this.maxStarmapX, this.maxStarmapY, this.borderMap, this.solars, this.currentSystem);
    // this.solars[this.startSystem].figures.forEach(figure => {
    //   this.figures.push(figure);
    // });
    this.scheduler = new Scheduler(this);
    this.loadSolar();

    for (let i = 1; i <= 7; i++) { // генерируем все корабли для справки
      const ship = new Ship(i, new Point(i * this.helpFigureStep + this.helpPoint0.x,  this.helpPoint0.y), null);
      ship.logicRole = new LogicRole(Role.PLAYER, ship, this.maxMapX, this.maxMapY);
      this.helpFigures.push(ship);
    }

    // const cont =  new Cont(new Point(300, 300), this.figures, Goods.NARCOTICS, 1);
    // this.figures.push(cont);
    //
    // const ship1 = new Ship(3, new Point(800, 300), this.figures);
    // this.figures.push(ship1);
    // ship1.logicRole = new LogicRole(Role.NONE, ship1, this.maxMapX, this.maxMapY);
    // ship1.fraction = Fraction.MINER;

    //
    // this.ship2 = new Ship(3, new Point(800, 400), this.figures);
    // this.figures.push(this.ship2);
    // this.ship2.target = this.ship1;
    // this.ship2.logicRole = new LogicRole(Role.CONVOY, this.ship2, this.maxMapX, this.maxMapY);
    // this.ship2.fraction = Fraction.POLICE;
  }

  // forward(speed: number) {
  //   this.playerShip.forward(speed);
  // }
  //
  // povorot(rot: number) {
  //   this.playerShip.povorot(rot);
  // }

  mouseMove($event: MouseEvent) {
    switch ($event.button) {
      case 0: {
        this.joy.use($event.offsetX, $event.offsetY, this.point0);
        this.quickMenu.use($event.offsetX, $event.offsetY, this.point0);
        if (this.menu === Menu.MAP) {
          this.starmap.use($event.offsetX, $event.offsetY);
        }
        break;
      }
      case 2: {
        break;
      }
    }
  }

  mouseDown($event: MouseEvent) {
    const x = $event.offsetX;
    const y = $event.offsetY;
    switch ($event.button) {
      case 0: {
        if (this.joy.checkOnArea(x, y)) {
          this.joy.start(x, y, this.point0);
        } else {
          if (this.menu === Menu.MAP) {
            this.starmap.start(x, y);
          } else {
            if (this.playerShip === null) {
              return;
            }
            if (((x < this.maxAreaX) && (y < this.maxAreaY - this.menuY)) ||
              ((x < this.maxAreaX - this.menuX) && (y > this.maxAreaY - this.menuY))) {
              this.quickMenu.start(x, y, this.point0);
            }
          }
        }
        break;
      }
      case 2: {
        break;
      }
    }
  }

  mouseUp($event: MouseEvent) {
    const x = $event.offsetX;
    const y = $event.offsetY;
    switch ($event.button) {
      case 0: {
        this.joy.reset();
        if (this.playerShip === null) {
          return;
        }
        this.starmap.reset();
        if (this.menu === Menu.HELP) {
          for (const figure of this.helpFigures) { // выделяем корабль в режиме справки
            if (UtilService.inRadius(figure.point0, new Point(
              this.quickMenu.point0.x - this.borderMap - figure.radius + this.point0.x,
              this.quickMenu.point0.y - this.borderMap - figure.radius + this.point0.y), figure.radius * 1.3)) {
              this.helpTarget = figure;
            }
          }
        }
        switch (this.quickMenu.reset()) {
          case 1: { // выбор
            let t: Figure = null;
            for (const figure of this.figures) { // если на фоне например планеты находится корабль, то выбираем именно корабль
              if (figure.checkOnArea(this.quickMenu.point0.x, this.quickMenu.point0.y)) {
                if (t === null) {
                  t = figure;
                } else {
                  if (!(figure instanceof Orb)) { // если нашли помимо Orb
                    if (figure.state !== State.DOCK) { // если объект не пристыкован
                      t = figure;
                      break;
                    }
                  }
                }
              }
            }
            if (t !== null) { // если нашли новую цель, то заменяем
              this.playerShip.target = t;
            }
            break;
          }
          case 2: { // сброс
            if (this.playerShip.state !== State.DOCK) {
              this.playerShip.allReset();
              this.fromBattleMode();
            }
            break;
          }
          case 3: { // движение
            if (this.playerShip.state !== State.DOCK) {
              this.playerShip.moveToTarget(State.IDLE);
            }
            break;
          }
          case 4: {  // действие
            if (this.playerShip.state !== State.DOCK) {
              if (this.playerShip.target !== null) {
                if (this.isMayDock(this.playerShip.target)) {
                  this.playerShip.dock();
                }
                if (this.isMayMine(this.playerShip.target)) {
                  this.playerShip.doMine();
                }
                if (this.isMayTake(this.playerShip.target)) {
                  this.playerShip.doTake();
                }
              }
            }
            break;
          }
        }
        break;
      }
      case 2: { // правая кнопка мыши, перемещение, если не гиперпереход
        if (this.playerShip === null) {
          return;
        }
        if (this.playerShip.state !== State.JUMP) {
          this.playerShip.chekpoints.push(new Point(x - this.point0.x, y - this.point0.y));
        }
        break;
      }
    }
  }

  isMayDock(target: Figure): boolean {
    if (target instanceof Orb) {
      if (((target as Orb).typeOrb === TypeOrb.PLANET) || ((target as Orb).typeOrb === TypeOrb.STATION)) {
        return true;
      }
    }
    return false;
  }

  isMayMine(target: Figure): boolean {
    if (target instanceof Orb) {
      if ((target as Orb).typeOrb === TypeOrb.BELT) {
        return true;
      }
    }
    return false;
  }

  isMayTake(target: Figure): boolean {
    return (target instanceof Cont);
  }

  isMayBattle(target: Figure): boolean {
    return (target instanceof Ship);
  }


  moveToTarget() {
    this.playerShip.moveToTarget(State.IDLE);
  }

  followToTarget() {
    this.playerShip.moveToTarget(State.FOLLOW);
  }

  dock() {
    this.playerShip.dock();
  }

  undock() {
    this.playerShip.undock();
    this.saveGame();
    this.needSave = true;
  }

  mine() {
    this.playerShip.doMine();
  }

  take() {
    this.playerShip.doTake();
  }


  fireRocket() {
    this.playerShip.battleTarget = this.playerShip.target;
    this.playerShip.fireRocket();
  }

  fireLaser() {
    this.playerShip.battleTarget = this.playerShip.target;
    this.playerShip.fireLaser();
  }

  mouseWheel($event: WheelEvent) {
    this.starmap.mouseWheel($event.deltaY);
  }

  hyperjumpStartAnim() {
    if ((this.playerShip.currentFuel >= this.starmap.hyperjumpDistance) &&
      (this.starmap.target !== -1) &&
      (this.starmap.target !== this.currentSystem) &&
      (this.playerShip.state !== State.DOCK)) { // прыжок в другую систему, если хватает топлива и находимся не на станции
        this.playerShip.hyperjumpStartAnim();
        this.menu = Menu.TARGET;
    }
  }

  hyperjump() {
    this.playerShip.hyperjump(this.starmap.hyperjumpDistance, this.point0, this.maxAreaX, this.maxAreaY, this.maxMapX, this.maxMapY);
    this.currentSystem = this.starmap.target;
    this.saveGame();
    this.loadSolar();
  }

  loadSolar() {
    this.figures.length = 0;  // очищаем текущий  массив объектов
    this.solars[this.currentSystem].figures.forEach(figure => this.figures.push(figure));
    this.starmap.target = this.currentSystem;
    if (this.playerShip !== null) {
      this.figures.push(this.playerShip);
    }
    this.scheduler.generateNPC();
  }

  createPriceGoods(orb: Orb) { // считаем стоимость товаров на планете
    orb.goodsPriceOnPlanet.length = 0;
    this.goods.forEach(value =>
      orb.goodsPriceOnPlanet.push(value.calcPrice(this.solars[this.currentSystem].economy, this.solars[this.currentSystem].riches)));
  }

  private createMarket(solar: Solar, orb: Orb) {
    orb.market.length = 0;
    for (let i = 0; i < 24; i++) {
      orb.market.push(this.emptyEquipment);
    }
    let level = 0;
    for (let i = 0; i < solar.riches.qtMarket; i++) {
      level = UtilService.getRandomInteger(0, solar.techLevel);
      switch (UtilService.getRandomInteger(0, 8)) {
        case 0: orb.market[i] = new Armor(level); break;
        case 1: orb.market[i] = new Capacitor(level); break;
        case 2: orb.market[i] = new Cargobay(level); break;
        case 3: orb.market[i] = new Fueltank(level); break;
        case 4: orb.market[i] = new Lasergun(level); break;
        case 5: orb.market[i] = new Rocketlauncher(level); break;
        case 6: orb.market[i] = new Shield(level); break;
        case 7: orb.market[i] = new Engine(level); break;
        case 8: orb.market[i] = new Container(level); break;
      }
    }
  }

  hyperjumpCancel() {
    this.playerShip.hyperjumpCancel();
  }

  toBattleMode() {
    // чтобы можно было войти в режим битвы с другим кораблем, когда уже в данном режиме. Через другую роль
    this.playerShip.logicRole.newRole(Role.PLAYER, this.playerShip.target);
    this.playerShip.logicRole.newRole(Role.BATTLE, this.playerShip.target);
  }

  fromBattleMode() {
    this.playerShip.allReset();
    this.playerShip.logicRole.role = Role.PLAYER;
    this.playerShip.battleTarget = null;
    this.playerShip.battleMode = false;
  }

  calcFullCargo(): number{
    let vol = 0;
    this.inventory.filter(value => value.type === Equip.CONTAINER).forEach(value => vol += (value as Container).volume);
    this.playerShip.maxVolume = vol;
    return this.inventory.filter(value => value !== this.emptyEquipment).length;
  }

  newGame() {
    this.gameService.getEs().subscribe(games => {
      this.playerShip = new Ship(1, new Point(0, 0), this.figures);
      this.playerShip.viewTargets = true;
      this.playerShip.logicRole = new LogicRole(Role.PLAYER, this.playerShip, this.maxMapX, this.maxMapY);
      this.playerShip.fraction = Fraction.TRADER;

      const currentGames = games.filter(value => ((value.user !== null) && (value.user.id === this.userService.user.id)));
      if ((currentGames !== null) && (currentGames.length > 0)) {
        this.gameService.gameDTO = currentGames[0];
      } else {
        this.gameService.gameDTO = new GameDTO(null,
          1000,
          this.playerShip.currentHp * 10,
          this.playerShip.currentFuel * 10,
           this.playerShip.currentRocket,
           this.startSystem,
          0,
          '',
          '',
          '',
          this.userService.user);
      }
      if ((this.gameService.gameDTO.goods !== null) && (this.gameService.gameDTO.goods.length > 0)) {
        this.playerShip.goodsInBay = this.gameService.gameDTO.goods.split(',').map(value => parseInt(value, 10));
        this.playerShip.currentVolume = this.playerShip.goodsInBay.reduce((acc, cur) => acc + cur);
      }
      if ((this.gameService.gameDTO.equip !== null) && (this.gameService.gameDTO.equip.length > 0)) {
        this.playerShip.equipments.forEach(value => {
          value.install(this.playerShip, -1);
        });
        this.gameService.gameDTO.equip.split(',').forEach(value => {
          switch (value.charAt(0)) {
            case 'A': {
              new Armor(Number(value.charAt(1))).install(this.playerShip, 1);
              break;
            }
            case 'C': {
              new Capacitor(Number(value.charAt(1))).install(this.playerShip, 1);
              break;
            }
            case 'T': {
              new Cargobay(Number(value.charAt(1))).install(this.playerShip, 1);
              break;
            }
            case 'E': {
              new Engine(Number(value.charAt(1))).install(this.playerShip, 1);
              break;
            }
            case 'F': {
              new Fueltank(Number(value.charAt(1))).install(this.playerShip, 1);
              break;
            }
            case 'L': {
              new Lasergun(Number(value.charAt(1))).install(this.playerShip, 1);
              break;
            }
            case 'R': {
              new Rocketlauncher(Number(value.charAt(1))).install(this.playerShip, 1);
              break;
            }
            case 'S': {
              new Shield(Number(value.charAt(1))).install(this.playerShip, 1);
              break;
            }
          }
        });
      }
      this.inventory.length = 0;
      if ((this.gameService.gameDTO.inventory !== null) && (this.gameService.gameDTO.inventory.length > 0)) {
        this.gameService.gameDTO.inventory.split(',').forEach(value => {
          switch (value.charAt(0)) {
            case '0': {
              this.inventory.push(this.emptyEquipment);
              break;
            }
            case 'A': {
              this.inventory.push(new Armor(Number(value.charAt(1))));
              break;
            }
            case 'C': {
              this.inventory.push(new Capacitor(Number(value.charAt(1))));
              break;
            }
            case 'T': {
              this.inventory.push(new Cargobay(Number(value.charAt(1))));
              break;
            }
            case 'E': {
              this.inventory.push(new Engine(Number(value.charAt(1))));
              break;
            }
            case 'F': {
              this.inventory.push(new Fueltank(Number(value.charAt(1))));
              break;
            }
            case 'L': {
              this.inventory.push(new Lasergun(Number(value.charAt(1))));
              break;
            }
            case 'R': {
              this.inventory.push(new Rocketlauncher(Number(value.charAt(1))));
              break;
            }
            case 'S': {
              this.inventory.push(new Shield(Number(value.charAt(1))));
              break;
            }
            case 'G': {
              this.inventory.push(new Container(Number(value.charAt(1))));
              break;
            }
          }
        });
      } else {
        for (let i = 0; i < this.playerShip.maxCargo; i++) {
          this.inventory.push(this.emptyEquipment);
        }
        this.inventory[0] = new Container(2);
      }
      this.playerShip.currentCargo = this.calcFullCargo();
      this.credits = this.gameService.gameDTO.credits / 10;
      this.playerShip.currentHp = this.gameService.gameDTO.armor / 10;
      this.playerShip.currentFuel = this.gameService.gameDTO.fuel / 10;
      this.playerShip.currentRocket = this.gameService.gameDTO.rocket;
      this.currentSystem = this.gameService.gameDTO.system;
      this.loadSolar();
      if (this.gameService.gameDTO.planet === -1) {
        this.playerShip.hyperjump(0, this.point0, this.maxAreaX, this.maxAreaY, this.maxMapX, this.maxMapY);
      } else {
        let onDock = false;
        for (const figure of this.figures) {
          if ((figure instanceof Orb) && ((figure as Orb).id === this.gameService.gameDTO.planet)) {
            this.playerShip.onDock = figure;
            this.playerShip.pointBeforeDock.setValue(this.playerShip.point0);
            this.playerShip.state = State.DOCK;
            this.playerShip.currentSpeed = 0;
            onDock = true;
            let x = -figure.point0.x + this.maxAreaX / 2;
            let y = -figure.point0.y + this.maxAreaY / 2;
            if (x > 0) {
              x = 0;
            }
            if (x < -(this.maxMapX - this.maxAreaX)) {
              x = -(this.maxMapX - this.maxAreaX);
            }
            if (y > 0) {
              y = 0;
            }
            if (y < -(this.maxMapY - this.maxAreaY)) {
              y = -(this.maxMapY - this.maxAreaY);
            }
            this.point0.x = x;
            this.point0.y = y;
            break;
          }
        }
        if (onDock === false) {
          this.playerShip.hyperjump(0, this.point0, this.maxAreaX, this.maxAreaY, this.maxMapX, this.maxMapY);
        }
      }
    });
  }

  private rebirth() {
    this.playerShip.allReset();
    this.credits *= 0.9;
    this.playerShip.currentHp = this.playerShip.maxHp;
    this.playerShip.currentFuel = this.playerShip.maxFuel;
    this.playerShip.currentShield = this.playerShip.maxShield;
    this.playerShip.currentVolume = 0;
    this.playerShip.goodsInBay.fill(0);
    for (const figure of this.figures) {
      if ((figure instanceof Orb) && ((figure as Orb).id === 0)) {
        this.playerShip.onDock = figure;
        this.playerShip.pointBeforeDock.setValue(this.playerShip.point0);
        this.playerShip.state = State.DOCK;
        this.playerShip.currentSpeed = 0;
        this.figures.push(this.playerShip);
        this.sms('Вы погибли', 1);
        break;
      }
    }
    this.saveGame();
  }

  saveGame() {
    this.gameService.gameDTO.credits = this.credits * 10;
    this.gameService.gameDTO.armor = this.playerShip.currentHp * 10;
    this.gameService.gameDTO.fuel = this.playerShip.currentFuel * 10;
    this.gameService.gameDTO.rocket = this.playerShip.currentRocket;
    this.gameService.gameDTO.system = this.currentSystem;
    this.gameService.gameDTO.planet = (this.playerShip.onDock !== null) ? (this.playerShip.onDock as Orb).id : -1;
    this.gameService.gameDTO.equip = Array.from(this.playerShip.equipments.values()).map(value => value.label).join(',');
    this.gameService.gameDTO.inventory = this.inventory.map(value => value.label).join(',');
    this.gameService.gameDTO.goods = this.playerShip.goodsInBay.toString();
    this.gameService.addOrUpdate(this.gameService.gameDTO).subscribe(value => {
      if (this.gameService.gameDTO.id === null) {
        this.gameService.gameDTO = value;
      }
    });
  }

  login() {
    if (this.userService.login()) {
      this.newGame();
    }
  }

  logout() {
    this.userService.logout();
    this.menu = Menu.TARGET;
    this.userService.password = '';
    this.figures.splice(this.figures.indexOf(this.playerShip), 1); // удаляем объект с карты
    this.playerShip = null;
  }

}
