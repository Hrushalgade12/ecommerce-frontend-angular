import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login, SignUp } from 'src/data-type';
import { SellerService } from '../services/seller.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent implements OnInit {
  constructor(private sellerService: SellerService, private router: Router, private userService:UserService) {}
  showLogin=false;
  authError:string='';
  ngOnInit(): void {
    this.sellerService.reloadSeller();
  }
  signUp(data: SignUp): void {
   this.sellerService.userSignUp(data);
  }
  login(data: Login): void {
    this.authError="";
    this.userService.userLogin(data);
    this.userService.isLoginError.subscribe((isError)=>{
      if (isError){
this.authError="Email/Password is not correct.";
      }
    })
  }
  openLogin(){
this.showLogin=true;
  }
  openSignUp(){
    this.showLogin=false;
  }
}
