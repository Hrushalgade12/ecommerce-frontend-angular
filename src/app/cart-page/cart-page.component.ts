import { Component, OnInit } from '@angular/core';
import { Cart, PriceSummary } from 'src/data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartData: Cart[] | undefined;
  priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    deliveryCharges: 0,
    total: 0,
  };
  constructor(private productService: ProductService, private route:Router) {}
  ngOnInit(): void {
    this.loadDetails();
  }
  removeToCart(id: string) {
    let user = localStorage.getItem('user');
    let userobj = user && JSON.parse(user);
    let userId = userobj && userobj[0].id;
    this.productService.removeFromCart(id).subscribe((result) => {
      if (result) {
        this.loadDetails();
      }
    });

  
  }
  checkout() {
    this.route.navigate(['/checkout']);
  }
  loadDetails(){
    
    this.productService.currentCart().subscribe((result) => {
      this.cartData = result;
      let price = 0;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + item.price * item.quantity;
        }
      });
      this.priceSummary.price = price;
      if (this.priceSummary.price !== 0) {
        this.priceSummary.tax = this.priceSummary.price / 10;
        this.priceSummary.discount = this.priceSummary.price / 15;
        this.priceSummary.deliveryCharges = 99;
        this.priceSummary.total =
          this.priceSummary.price +
          this.priceSummary.tax +
          this.priceSummary.discount +
          this.priceSummary.deliveryCharges;

        }
        if (!this.cartData.length) {
          this.route.navigate(['/'])
          
        }
      });
  }
}
