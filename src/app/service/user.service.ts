import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export class User {

  constructor(
    public id: number,
    public username: string,
    public password: string) { }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // public url = 'http://localhost:8080/user';
  public url = 'https://juliomoralezspaceserver.herokuapp.com/user';
  public user: User = null;
  public users: User[] = null;
  invalid = false;
  public username = '';
  public password = '';
  public message = '';
  public messageStyle = '';
  public messageSuccess = 'alert alert-success';
  public messageDanger = 'alert alert-danger';

  constructor(private http: HttpClient) { }


  getE(id: string): Observable<User> {
    return this.http.get<User>(this.url + '/' + id).pipe(tap(x => this.user = x));
  }

  getEs(): Observable<User[]> {
    return this.http.get<User[]>(this.url + 's/').pipe(tap(x => this.users = x));
  }

  delete(id: number): Observable<User> {
    return this.http.delete<User>(this.url + '/' + id);
  }

  addOrUpdate(user: User) {
    return this.http.post<User>(this.url + '/', user);
  }

  isUserLoggedIn(): boolean {
    const user = sessionStorage.getItem('id');
    return !(user === null);
  }

  login(): boolean {
    if (this.users !== null) {
      const users = this.users.filter(value => ((value.username === this.username) && (value.password === this.password)));
      if (users.length > 0) {
        sessionStorage.setItem('id', users[0].id.toString());
        this.user = users[0];
        this.invalid = false;
        return true;
      } else {
        this.message = 'Вход не выполнен';
        this.messageStyle = this.messageDanger;
        this.invalid = true;
        return false;
      }
    } else {
      this.message = 'Нет данных от сервера';
      this.messageStyle = this.messageDanger;
      return false;
    }
  }

  logout() {
    sessionStorage.removeItem('id');
    this.message = '';
    this.user = null;
  }
}
