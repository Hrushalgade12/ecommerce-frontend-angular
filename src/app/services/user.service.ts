import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { SignUp, Login } from 'src/data-type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public $refreshToken = new Subject<boolean>();
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter<boolean>(false);
  constructor(private http: HttpClient, private route: Router) {}
  userSignUp(data: SignUp) {
    this.http
      .post('http://localhost:3000/user', data, { observe: 'response' })
      .subscribe((result) => {
        if (data.name && data.email && data.password) {
          this.isUserLoggedIn.next(true);
          localStorage.setItem('user', JSON.stringify(result.body));
          this.route.navigate(['']);
          console.warn(result);
        }
      });
    return false;
  }
  userLogin(data: Login) {
    console.warn(data);
    this.http
      .post(`http://localhost:8080/login`, data, { observe: 'response' }).subscribe((result:any) => {
        console.warn(result);
          if (result && result.body) {
            console.warn('User Logged In');
            localStorage.setItem('user', JSON.stringify(result.body));
            this.route.navigate(['']);
          } else {
            this.isLoginError.emit(true);
            console.warn('Login Failed');
          }
        },
        (error) => {
          alert('Login Failed');
        }
      );
    return false;
  }

  reloadUser() {
    if (localStorage.getItem('user')) {
      this.isUserLoggedIn.next(true);
      this.route.navigate(['']);
    }
  }

  getRefreshToken() {
    let loggedUserData: any = {};
    const localData = localStorage.getItem('user');
    if (localData) {
      loggedUserData = JSON.parse(localData);
    }
    const obj = {
      token: loggedUserData.token,
    };
    this.http
      .post('http://localhost:8080/refreshToken', obj)
      .subscribe((result: any) => {
        if (result) {
          console.warn('User Logged In');
          console.warn(result.accessToken);
          localStorage.setItem('user', JSON.stringify(result));
        } else {
          this.isLoginError.emit(true);
          console.warn('Login Failed');
        }
      });
  }
}
