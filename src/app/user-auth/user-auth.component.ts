import { Component, OnInit } from '@angular/core';
import { Cart, Login, Product, SignUp } from 'src/data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  showLogin = false;
  authError: string = '';
  constructor(private user: UserService, private product: ProductService) {}
  ngOnInit(): void {}

  signUp(data: SignUp): void {
    this.user.userSignUp(data);
    this.localCartToDb();
  }
  login(data: Login): void {
    this.authError = '';
    this.user.userLogin(data);
    this.user.isLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = 'Email/Password is not correct.';
      }
    });
    setTimeout(() => {
      this.localCartToDb();
    }, 2000);
  }
  openLogin() {
    this.showLogin = true;
  }
  openSignUp() {
    this.showLogin = false;
  }
  localCartToDb() {
    let user = localStorage.getItem('user');
    console.log(user);
    const userObj = user && JSON.parse(user);
    let userId = user && userObj[0].id;
    console.warn('ID1 ' + userId);
    let data = localStorage.getItem('localCart');
    if (data) {
      let userId = user && JSON.parse(user).id;
      let cartDataList: Product[] = JSON.parse(data);
      cartDataList.forEach((prod: Product, index) => {
        let cartData: Cart = {
          ...prod,
          productId: prod.id,
          userId,
        };
        setTimeout(() => {
          this.product.addUserProductToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn('Item stored in DB');
            }
          });
          if (cartDataList.length === index + 1) {
            localStorage.removeItem('localCart');
          }
        }, 500);
      });
    }

    setTimeout(() => {
      console.warn(userId);
      this.product.getCartList(userId);
    }, 2000);
  }
}
