import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {UtilService} from '../service/util.service';
import {Star} from '../service/star';
import {Figure} from '../service/figure';
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

  constructor(private utilService: UtilService) { }

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
  figures: Figure[] = [];
  point0 = new Point(0, 0); // глобальная точка отсчёта карты
  joy = new Joy(new Point(this.maxAreaX - 150, this.maxAreaY - 150),
                new Point(0, 0),
                new Point(this.maxMapX - this.maxAreaX, this.maxMapY - this.maxAreaY));
  menu = new Menu();



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
          this.stars[i].x = this.utilService.getRandomInteger(0, this.maxAreaX);
          this.stars[i].y = 0;
        }
      }
      this.joy.shiftPoint(this.point0);

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.figures.length; i++) {
        // if (this.figures[i] instanceof Orb) {
        //   (this.figures[i] as Orb).moveOnEllipse();
        //   continue;
        // }
        this.figures[i].moveOnEllipse();
      }
      this.figures[0].moveToCheckpoint();
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
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.figures.length; i++) {
      this.figures[i].draw(this.ctx, this.point0);
    }
    // джойстик
    this.joy.draw(this.ctx);

    // меню
    this.menu.draw(this.ctx, this.point0);

    // цель

    // if (this.figures[0].chekpoints !== null) {
    //   this.ctx.beginPath();
    //   this.ctx.lineWidth = 5;
    //   this.ctx.strokeStyle = 'blue';
    //   this.ctx.arc(this.figures[0].chekpoints.x  + this.point0.x, this.figures[0].chekpoints.y  + this.point0.y, 20,  0, 2 * Math.PI);
    //   this.ctx.stroke();
    // }
  }



  private initGameObjects() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    for (let i = 0; i < this.countStars; i++) {
      this.stars.push(
        new Star(this.utilService.getRandomInteger(0, this.maxAreaX), this.utilService.getRandomInteger(0, this.maxAreaY), i));
    }

    const j = 0;
    const p = new Point(100, 400);
    this.figures[j] = new Ship(p);
    this.figures[j].points.push(new Point(p.x, p.y - 50));
    this.figures[j].points.push(new Point(p.x + 50, p.y + 50));
    this.figures[j].points.push(new Point(p.x, p.y + 50));
    this.figures[j].points.push(new Point(p.x - 50, p.y + 50));
    this.figures[j].setAxis(this.figures[j].points[0], this.figures[j].points[2]);
    // this.figures[j].target = new Point(101, 600);
    const color = 'red';
    const width = 1;
    this.figures[j].lines.push(new Line(0, 1, 'blue', width));
    this.figures[j].lines.push(new Line(1, 3, color, width));
    this.figures[j].lines.push(new Line(3, 0, 'green', 5));
    this.figures[j].lines.push(new Line(0, 2, color, width));

    this.figures[1] = new Orb(new Point(this.maxMapX / 2, this.maxMapY / 2), TypeOrb.SUN, 100, 'yellow', 'red');
    this.figures[2] = new Orb(new Point(0, 0), TypeOrb.PLANET, 50, 'yellow', 'green');
    this.figures[2].setParent((this.figures[1] as Orb), 600, 400, -500,   3   );
    this.figures[3] = new Orb(new Point(0, 0), TypeOrb.SATELLITE, 20, 'yellow', 'blue');
    this.figures[3].setParent((this.figures[2] as Orb), 100, 100, 50,   3  );
    this.figures[4] = new Orb(new Point(0, 0), TypeOrb.SATELLITE, 10, 'orange', 'yellow');
    this.figures[4].setParent((this.figures[3] as Orb), 100, 50, -40,   Math.PI / 2  );
    this.figures[5] = new Orb(new Point(0, 0), TypeOrb.SATELLITE, 15, 'yellow', 'yellow');
    this.figures[5].setParent((this.figures[2] as Orb), 50, 50, 100,   1  );
  }

  forward(speed: number) {
    this.figures[0].forward(speed);
  }

  povorot(rot: number) {
    this.figures[0].povorot(rot);
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
      this.menu.start(x, y, this.point0);
    }
  }

  mouseUp() {
    this.joy.reset();
    switch (this.menu.reset()) {
      case 1: { // выбор
        for (const figure of this.figures) {
          if (figure.checkOnArea(this.menu.point0)) {
            this.figures[0].target = figure;
            break;
          }
        }
        break;
      }
      case 2: { // сброс
        this.figures[0].resetTarget();
        break;
      }
      case 3: { // движение
        this.figures[0].chekpoints.push(new Point(this.menu.point0.x, this.menu.point0.y));
        break;
      }
      case 4: {
        break;
      }
    }
  }


  moveToTarget() {
    this.figures[0].moveToTarget();
  }

  followToTarget() {
    this.figures[0].followToTarget();
  }
}
