import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {UtilService} from '../service/util.service';
import {Star} from '../service/star';
import {Figure, State} from '../service/figure';
import {Point} from '../service/point';
import {Joy} from '../service/joy';
import {Orb, TypeOrb} from '../service/orb';
import {Ship} from '../service/ship';
import {Menu} from '../service/menu';
import {Equipment} from '../service/equipment/equipment';
import {Starmap} from '../service/starmap';
import {Solar} from '../service/solar';
import {resolveGlobs} from 'tslint/lib/files/resolution';

export enum Trade {
  NONE, SHIP, INVENTORY, MARKET
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor() { }

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
  maxAreaY = 800;
  maxMapX = this.maxAreaX * 2;
  maxMapY = this.maxAreaY * 2;
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
  joy = new Joy(new Point(this.maxAreaX - 150, this.maxAreaY - 150),
                new Point(0, 0),
                new Point(this.maxMapX - this.maxAreaX, this.maxMapY - this.maxAreaY));
  menu = new Menu();
  playerShip: Ship = null;
  public inventory: Equipment[] = [];
  public market: Equipment[] = [];
  emptyEquipment: Equipment = new Equipment();
  public trade = Trade.NONE;
  public credits = 100;
  solars: Solar[] = [];
  starmap: Starmap = null;
  starmapView = false;


  ngOnInit(): void {
    this.initGameObjects();
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
        figure.moveToCheckpoint();
        figure.moveOnEllipse();
      }
      this.refreshCanvas();
    });

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
    this.menu.draw(this.ctx, this.point0);

    // интерфейс меню
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'orange';
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
    this.ctx.strokeStyle = 'orange';
    this.ctx.beginPath();
    this.ctx.rect(scaleX, scaleY, maxScale, 12);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.rect(scaleX, scaleY + 20, maxScale, 12);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.rect(scaleX, scaleY + 40, maxScale, 12);
    this.ctx.stroke();
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
    this.ctx.strokeStyle = 'orange';
    this.ctx.rect(this.maxAreaX  - this.menuX + this.borderMinimap,
                  this.maxAreaY  - this.minimapXY - this.borderMinimap, this.minimapXY , this.minimapXY);
    this.ctx.stroke();
    for (const figure of this.figures) {
      this.drawOnMiniMap(figure);
    }
    if (this.starmapView) {
      this.starmap.draw(this.ctx, this.currentSystem, this.playerShip.currentFuel);
    }
  }

  drawOnMiniMap(figure: Figure) {
    const x = figure.point0.x * this.minimapXY / this.maxMapX + this.maxAreaX  - this.menuX + this.borderMinimap - 2;
    const y = figure.point0.y * this.minimapXY / this.maxMapY + this.maxAreaY - this.minimapXY - this.borderMinimap - 2;
    if ((x > (this.maxAreaX - this.menuX + this.borderMinimap - 2)) &&
        (x < (this.maxAreaX - this.borderMinimap - 2)) &&
        (y > (this.maxAreaY - this.minimapXY - this.borderMinimap)) &&
        (y < (this.maxAreaY - this.borderMinimap))) {
      this.ctx.beginPath();
      this.ctx.fillStyle = 'yellow';
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

    this.solars = Solar.generate(256, this.maxMapX, this.maxMapY, this.maxStarmapX, this.maxStarmapY);
    this.starmap =
      new Starmap(this.maxStarmapX, this.maxStarmapY, this.borderMap, this.solars);
    this.solars[this.startSystem].figures.forEach(figure => this.figures.push(figure));

    this.playerShip = new Ship(new Point(100, 400), this.figures);
    this.playerShip.playerShip = true;
    this.figures.push(this.playerShip);

    // this.figures.push( new Ship(new Point(400, 400), this.figures));
  }

  forward(speed: number) {
    this.playerShip.forward(speed);
  }

  povorot(rot: number) {
    this.playerShip.povorot(rot);
  }

  mouseMove($event: MouseEvent) {
    this.joy.use($event.offsetX, $event.offsetY, this.point0);
    this.menu.use($event.offsetX, $event.offsetY, this.point0);
    if (this.starmapView) {
      this.starmap.use($event.offsetX, $event.offsetY);
    }
  }

  mouseDown($event: MouseEvent) {
    const x = $event.offsetX;
    const y = $event.offsetY;
    if (this.joy.checkOnArea(x, y)) {
      this.joy.start(x, y, this.point0);
    } else {
      if (this.starmapView) {
        this.starmap.start(x, y);
      } else {
        if (((x < this.maxAreaX) && (y < this.maxAreaY - this.menuY)) ||
          ((x < this.maxAreaX - this.menuX) && (y > this.maxAreaY - this.menuY))) {
          this.menu.start(x, y, this.point0);
        }
      }
    }
  }

  mouseUp() {
    this.joy.reset();
    this.starmap.reset();
    switch (this.menu.reset()) {
      case 1: { // выбор
        for (const figure of this.figures) {
          if (figure.checkOnArea(this.menu.point0.x, this.menu.point0.y)) {
            this.playerShip.target = figure;
            break;
          }
        }
        break;
      }
      case 2: { // сброс
        this.playerShip.resetTarget();
        break;
      }
      case 3: { // движение
        this.playerShip.chekpoints.push(new Point(this.menu.point0.x, this.menu.point0.y));
        break;
      }
      case 4: {
        break;
      }
    }
  }


  moveToTarget() {
    this.playerShip.moveToTarget(State.IDLE);
  }

  followToTarget() {
    this.playerShip.moveToTarget(State.FOLLOW);
  }

  dock() {
    this.playerShip.moveToTarget(State.DOCKING);
  }

  undock() {
    this.playerShip.undock();
  }

  fireRocket() {
    this.playerShip.fireRocket();
  }

  fireLaser() {
    this.playerShip.fireLaser();
  }

  mouseWheel($event: WheelEvent) {
    this.starmap.mouseWheel($event.deltaY);
  }

  starmapSwitch() {
    this.starmapView = ! this.starmapView;
  }

  hyperjump() {
    if ((this.playerShip.currentFuel >= this.starmap.hyperjumpDistance) &&
      (this.starmap.target !== -1) &&
      (this.starmap.target !== this.currentSystem)) { // прыжок в другую систему, если хватает топлива
      this.figures.length = 0;  // очищаем текущий  массив объектов
      this.solars[this.starmap.target].figures.forEach(figure => this.figures.push(figure));
      this.figures.push(this.playerShip);
      this.currentSystem = this.starmap.target;
      this.playerShip.currentFuel -= this.starmap.hyperjumpDistance;
    }
  }

}
