import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {from, interval, of, Subscription} from 'rxjs';
import {UtilService} from '../service/util.service';
import {Star} from '../service/star';
import {Figure} from '../service/figure';
import {Point} from '../service/point';
import {Line} from '../service/line';
import {Joy} from '../service/joy';
import {Planet} from '../service/planet';
import {Ship} from '../service/ship';



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
  planetLayers: number[] = [];



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
        // if (this.figures[i] instanceof Planet) {
        //   (this.figures[i] as Planet).moveOnEllipse();
        //   continue;
        // }
        this.figures[i].moveOnEllipse();
      }
      this.figures[0].moveToTarget();
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
    //   if (this.figures[i] instanceof Planet) {
    //     if (Math.abs((this.figures[i] as Planet).deg) > 180) {
    //       this.planetLayers.push(i);
    //     } else {
    //       this.planetLayers.unshift(i);
    //     }
    //     console.log((this.figures[i] as Planet).deg, this.planetLayers);
    //   }
    // }





    // from(this.planetLayers).subscribe(value => this.figures[value].draw(this.ctx, this.point0));
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.figures.length; i++) {
      this.figures[i].draw(this.ctx, this.point0);
    }
    // джойстик
    this.joy.draw(this.ctx);

    // цель
    this.ctx.beginPath();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'red';
    this.ctx.arc(100, 500, 20,  0, 2 * Math.PI);
    this.ctx.stroke();
  }



  private initGameObjects() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    for (let i = 0; i < this.countStars; i++) {
      this.stars.push(
        new Star(this.utilService.getRandomInteger(0, this.maxAreaX), this.utilService.getRandomInteger(0, this.maxAreaY), i));
    }

    let j = 0;
    let p = new Point(100, 400);
    this.figures[j] = new Ship(p);
    this.figures[j].points.push(new Point(p.x, p.y - 50));
    this.figures[j].points.push(new Point(p.x + 50, p.y + 50));
    this.figures[j].points.push(new Point(p.x, p.y + 50));
    this.figures[j].points.push(new Point(p.x - 50, p.y + 50));
    this.figures[j].setAxis(this.figures[j].points[0], this.figures[j].points[2]);
    this.figures[j].target = new Point(100, 500);
    const color = 'red';
    const width = 1;
    this.figures[j].lines.push(new Line(0, 1, 'blue', width));
    this.figures[j].lines.push(new Line(1, 3, color, width));
    this.figures[j].lines.push(new Line(3, 0, 'green', 5));
    this.figures[j].lines.push(new Line(0, 2, color, width));

    this.figures[1] = new Planet(new Point(this.maxMapX / 2, this.maxMapY / 2), 100, 'yellow', 'red');
    this.figures[2] = new Planet(new Point(0, 0), 50, 'yellow', 'green');
    this.figures[2].setParent((this.figures[1] as Planet), 300, 100, -50,   3   );
    this.figures[3] = new Planet(new Point(0, 0), 20, 'yellow', 'blue');
    this.figures[3].setParent((this.figures[2] as Planet), 100, 100, 50,   3  );
    this.figures[4] = new Planet(new Point(0, 0), 10, 'orange', 'yellow');
    this.figures[4].setParent((this.figures[3] as Planet), 100, 50, -40,   Math.PI / 2  );
    this.figures[5] = new Planet(new Point(0, 0), 15, 'yellow', 'yellow');
    this.figures[5].setParent((this.figures[2] as Planet), 50, 50, 100,   1  );
  }

  forward(speed: number) {
    this.figures[0].forward(speed);
  }

  povorot(rot: number) {
    this.figures[0].povorot(rot);
  }

  mm($event: MouseEvent) {
    this.joy.useJoy($event.offsetX, $event.offsetY, this.point0);
  }
  mdown($event: MouseEvent) {
    this.joy.startJoy($event.offsetX, $event.offsetY, this.point0);
  }

  mup() {
    this.joy.resetJoy();
  }

  touchInit() {
    console.log('1');
    const el = document.getElementById('qwe');
    el.addEventListener('touchstart', this.handleStart, false);
  }

  handleStart(evt) {
    evt.preventDefault();
    console.log('2');
    const touches = evt.changedTouches;
  }
}
