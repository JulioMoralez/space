import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {fromEvent, interval, Observable, of, Subscription, timer} from 'rxjs';
import {filter, map, scan, take} from 'rxjs/operators';
import {UtilService} from '../service/util.service';
import {Star} from '../service/star';
import {Figure} from '../service/figure';
import {Point} from '../service/point';
import {Line} from '../service/line';
import {Planet} from '../service/planet';
import {Joy} from '../service/joy.';



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
  maxX = 1000;
  maxY = 800;
  figures: Figure[] = [];
  point0 = new Point(0, 0);
  joy = new Joy(new Point(this.maxX - 150, this.maxY - 150));



  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.initGameObjects();
  }

  @HostListener('window:keypress', ['$event']) spaceEvent(event: any) {
    this.key = event.key;
    console.log(event);
  }

  start() {

    const stream$ = new Observable(observer => {
      observer.next(2);
      // for (let i = 0; i < 5; i++) {
      //   setTimeout(() => console.log(i), 1000);
      // }
      observer.complete();
      observer.next(3);
      });
    stream$.subscribe(value => console.log(value));
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // console.log('q');
    // timer(2000).subscribe(value => console.log('e'));
    if (this.sub !== null) {
      this.sub.unsubscribe();
    }
    this.sub = interval(33).subscribe(value => {
      this.globalCount++;
      for (let i = 0; i < this.countStars; i++) {
        this.stars[i].y += this.stars[i].dy;
        if (this.stars[i].y > this.maxY) {
          this.stars[i].x = this.utilService.getRandomInteger(0, this.maxX);
          this.stars[i].y = 0;
        }
      }
      if (this.joy.clicked) {
        this.point0.x -= this.joy.shiftX;
        this.point0.y -= this.joy.shiftY;
      }
      this.refreshCanvas();
    });

  }

  private refreshCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // звезды
    this.ctx.fillStyle = 'yellow';
    for (let i = 0; i < this.countStars; i++) {
      this.stars[i].draw(this.ctx);
    }
    // объекты
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.figures.length; i++) {
      this.figures[i].draw(this.ctx, this.point0);
    }
    // джойстик
    this.ctx.beginPath();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'red';
    this.ctx.arc(this.joy.pointJoy0.x, this.joy.pointJoy0.y, this.joy.radiusArea, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.fillStyle = 'hsl(' + (100 + 2 * this.joy.h) + ',100%,40%)';
    this.ctx.beginPath();
    this.ctx.arc(this.joy.pointJoy.x, this.joy.pointJoy.y, this.joy.radiusJoy, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private initGameObjects() {
    for (let i = 0; i < this.countStars; i++) {
      this.stars.push(new Star(this.utilService.getRandomInteger(0, this.maxX), this.utilService.getRandomInteger(0, this.maxY), i));
    }

    this.figures[0] = new Figure();
    this.figures[0].x0 = 100;
    this.figures[0].y0 = 100;
    this.figures[0].points.push(new Point(100, 50));
    this.figures[0].points.push(new Point(150, 150));
    this.figures[0].points.push(new Point(100, 150));
    this.figures[0].points.push(new Point(50, 150));
    const color = 'red';
    const width = 1;
    this.figures[0].lines.push(new Line(0, 1, 'blue', width));
    this.figures[0].lines.push(new Line(1, 3, color, width));
    this.figures[0].lines.push(new Line(3, 0, 'green', 5));
    this.figures[0].lines.push(new Line(0, 2, color, width));

    this.figures[1] = new Planet();
    this.figures[1].x0 = 100;
    this.figures[1].y0 = 100;
  }

  forward(speed: number) {
    this.figures[0].forward(speed);
  }

  povorot(rot: number) {
    this.figures[0].povorot(rot);
  }

  mm($event: MouseEvent) {
    if (this.joy.clicked){
      this.joy.shiftJoy($event.offsetX, $event.offsetY, this.point0);
    }
  }
  mdown($event: MouseEvent) {

    this.joy.clicked = true;
    this.joy.shiftJoy($event.offsetX, $event.offsetY, this.point0);
  }

  mup($event: MouseEvent) {
    this.joy.clicked = false;
    this.joy.pointJoy.x = this.joy.pointJoy0.x;
    this.joy.pointJoy.y = this.joy.pointJoy0.y;
  }

  shiftMap2(dx: number, dy: number) {
    this.point0.x += dx;
    this.point0.y += dy;
    console.log(this.point0);
  }
}
