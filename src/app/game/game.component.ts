import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {UtilService} from '../service/util.service';
import {Star} from '../service/star';
import {Figure, State} from '../service/figure';
import {Point} from '../service/point';
import {Line} from '../service/line';
import {Joy} from '../service/joy';
import {Orb, TypeOrb} from '../service/orb';
import {Ship} from '../service/ship';
import {Menu} from '../service/menu';


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
  colors: string[] = ['#7fffd4', 'blue'];
  key = '1';
  color = 'black';
  flag = false;
  globalCount = 0;
  private sub: Subscription = null;
  countStars = 100;
  maxAreaX = 1000;
  maxAreaY = 800;
  maxMapX = this.maxAreaX * 2;
  maxMapY = this.maxAreaY * 2;
  borderMap = 50; // толщина границы карты
  menuX = 300;
  menuY = 0;
  borderMinimap = 10;
  minimapXY = this.menuX - 2 * this.borderMinimap;
  visibleAreaOnMinimapX = this.maxAreaX * this.minimapXY / this.maxMapX;
  visibleAreaOnMinimapY = this.maxAreaY * this.minimapXY / this.maxMapY;
  maxCanvasX = this.maxAreaX + this.menuX;
  maxCanvasY = this.maxAreaY + this.menuY;
  point0 = new Point(0, 0); // глобальная точка отсчёта карты
  figures: Figure[] = [];
  joy = new Joy(new Point(this.maxCanvasX - 150, this.maxCanvasY - 150),
                new Point(0, 0),
                new Point(this.maxMapX - this.maxAreaX, this.maxMapY - this.maxAreaY));
  menu = new Menu();
  playerShip: Ship = null;


  ngOnInit(): void {
    this.initGameObjects();
  }

  @HostListener('window:keypress', ['$event']) spaceEvent(event: any) {
    this.key = event.key;
    console.log(event);
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
    this.ctx.rect(this.maxAreaX, 0, this.maxCanvasX - this.maxAreaX, this.maxCanvasY);
    this.ctx.fill();
    this.ctx.stroke();

    // видимая область на миникарте
    this.ctx.beginPath();
    this.ctx.fillStyle = '#222';
    this.ctx.rect(-this.point0.x * this.minimapXY / this.maxMapX + this.maxAreaX + this.borderMinimap,
                  -this.point0.y * this.minimapXY / this.maxMapY + this.maxAreaY - this.minimapXY - this.borderMinimap,
                  this.visibleAreaOnMinimapX, this.visibleAreaOnMinimapY);
    this.ctx.fill();

    // джойстик
    this.joy.draw(this.ctx);

    // объекты на миникарте
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'orange';
    this.ctx.rect(this.maxAreaX + this.borderMinimap, this.maxAreaY - this.minimapXY - this.borderMinimap, this.minimapXY , this.minimapXY);
    this.ctx.stroke();
    for (const figure of this.figures) {
      this.drawOnMiniMap(figure);
    }
  }

  drawOnMiniMap(figure: Figure) {
    this.ctx.beginPath();
    this.ctx.fillStyle = 'yellow';
    this.ctx.fillRect(figure.point0.x * this.minimapXY / this.maxMapX + this.maxAreaX + this.borderMinimap - 2,
                      figure.point0.y * this.minimapXY / this.maxMapY + this.maxAreaY - this.minimapXY - this.borderMinimap - 2, 4 , 4);
    this.ctx.fill();
  }


  private initGameObjects() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    for (let i = 0; i < this.countStars; i++) {
      this.stars.push(
        new Star(UtilService.getRandomInteger(0, this.maxAreaX), UtilService.getRandomInteger(0, this.maxAreaY), i));
    }

    this.figures[0] = new Orb(new Point(this.maxMapX / 2, this.maxMapY / 2), TypeOrb.SUN, 100, 'yellow', 'red');
    this.figures[1] = new Orb(new Point(0, 0), TypeOrb.PLANET, 50, 'yellow', 'green');
    this.figures[1].setParent((this.figures[0] as Orb), 600, 400, -500,   3   );
    this.figures[2] = new Orb(new Point(0, 0), TypeOrb.SATELLITE, 20, 'yellow', 'blue');
    this.figures[2].setParent((this.figures[1] as Orb), 100, 100, 50,   3  );
    this.figures[3] = new Orb(new Point(0, 0), TypeOrb.SATELLITE, 10, 'orange', 'yellow');
    this.figures[3].setParent((this.figures[2] as Orb), 100, 50, -40,   Math.PI / 2  );
    this.figures[4] = new Orb(new Point(0, 0), TypeOrb.SATELLITE, 15, 'yellow', 'yellow');
    this.figures[4].setParent((this.figures[3] as Orb), 50, 50, 100,   1  );

    this.playerShip = new Ship(new Point(100, 400), this.figures);
    this.playerShip.playerShip = true;
    this.figures.push(this.playerShip);

    this.figures.push( new Ship(new Point(400, 400), this.figures));
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
  }

  mouseDown($event: MouseEvent) {
    const x = $event.offsetX;
    const y = $event.offsetY;
    if (this.joy.checkOnArea(x, y)) {
      this.joy.start(x, y, this.point0);
    } else {
      if (x < this.maxAreaX) {
        this.menu.start(x, y, this.point0);
      }
    }
  }

  mouseUp() {
    this.joy.reset();
    switch (this.menu.reset()) {
      case 1: { // выбор
        for (const figure of this.figures) {
          if (figure.checkOnArea(this.menu.point0)) {
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

  fire() {
    this.playerShip.fire();
  }
}
