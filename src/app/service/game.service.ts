import { Injectable } from '@angular/core';
import {User} from './user.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';



export class GameDTO {

  constructor(
    public id: number,
    public credits: number,
    public armor: number,
    public fuel: number,
    public rocket: number,
    public system: number,
    public planet: number,
    public equip: string,
    public inventory: string,
    public goods: string,
    public user: User) { }
}




@Injectable({
  providedIn: 'root'
})
export class GameService {

  // public url = 'http://localhost:8080/game';
  public url = 'https://juliomoralezspaceserver.herokuapp.com/game';
  public gameDTO: GameDTO = null;
  public gameDTOs: GameDTO[] = null;

  constructor(private http: HttpClient) { }

  getE(id: string): Observable<GameDTO> {
    return this.http.get<GameDTO>(this.url + '/' + id).pipe(tap(x => this.gameDTO = x));
  }

  getEs(): Observable<GameDTO[]> {
    return this.http.get<GameDTO[]>(this.url + 's/').pipe(tap(x => this.gameDTOs = x));
  }

  delete(id: number): Observable<GameDTO> {
    return this.http.delete<GameDTO>(this.url + '/' + id);
  }

  addOrUpdate(gameDTO: GameDTO) {
    return this.http.post<GameDTO>(this.url + '/', gameDTO);
  }
}
