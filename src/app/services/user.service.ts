import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SignUp, Login } from 'src/data-type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError=new EventEmitter<boolean>(false);
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
    this.http
      .get(
        `http://localhost:3000/user?email=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe((result: any) => {
        console.warn(data);
        if (result && result.body && result.body.length) {
          console.warn('User Logged In');
          localStorage.setItem('user', JSON.stringify(result.body));
          this.route.navigate(['']);
        } else {
          this.isLoginError.emit(true);
          console.warn('Login Failed');
        }
      });
    return false;
  }
  reloadUser() {
    if (localStorage.getItem('user')) {
      this.isUserLoggedIn.next(true);
      this.route.navigate(['']);
    }
  }

}
