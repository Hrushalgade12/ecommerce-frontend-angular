import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from 'src/data-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: String = 'default';
  sellerName: string = '';
  userName: string = '';
  searchResult: undefined | Product[];
  searchPage: boolean = false;
  cartItems: number = 0;
  constructor(
    private route: Router,
    private productService: ProductService,
    private act: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (val.url.includes('search')) {
          this.searchPage = true;
        } else {
          this.searchPage = false;
        }
      }
    });

    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          this.menuType = 'seller';
          if (localStorage.getItem('seller')) {
            let sellerStore = localStorage.getItem('seller');
            let sellerData = sellerStore && JSON.parse(sellerStore)[0];
            this.sellerName = sellerData?.name;
          }
        } else if (localStorage.getItem('user')) {
          this.menuType = 'user';
          if (localStorage.getItem('user')) {
            let userStore = localStorage.getItem('user');
            let userData = userStore && JSON.parse(userStore)[0];
            this.userName = userData?.name;
            this.productService.getCartList(userData.id);
          }
        } else {
          this.menuType = 'default';
        }
      }
    });

    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }

    this.productService.cartData.subscribe((items) => {
      this.cartItems = items.length;
    });
  }
  logOut() {
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }
  userLogOut() {
    localStorage.removeItem('user');
    this.productService.cartData.emit([]);
    this.route.navigate(['/']);
  }
  searchProduct(event: KeyboardEvent) {
    if (event) {
      const element = event.target as HTMLInputElement;
      this.productService.searchProducts(element.value).subscribe((result) => {
        this.searchResult = result;
      });
    }
  }
  searchHide() {
    this.searchResult = undefined;
  }
  navigateToDetails(id: string) {
    this.route.navigate(['/details/' + id]);
  }
  submitSearch(query: string) {
    this.route.navigate([`search/${query}`]);
  }
}
