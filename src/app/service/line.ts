
export class Line {
  private _p1: number;
  private _p2: number;
  private _color: string;
  private _width: number;


  constructor(p1: number, p2: number, color: string, width: number) {
    this._p1 = p1;
    this._p2 = p2;
    this._color = color;
    this._width = width;
  }

  get p1(): number {
    return this._p1;
  }

  set p1(value: number) {
    this._p1 = value;
  }

  get p2(): number {
    return this._p2;
  }

  set p2(value: number) {
    this._p2 = value;
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }


  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }
}
