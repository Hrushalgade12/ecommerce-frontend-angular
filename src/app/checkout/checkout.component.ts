import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Cart, Order, PriceSummary } from 'src/data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartData: Cart[] | undefined;
  orderMsg: string | undefined;
  priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    deliveryCharges: 0,
    total: 0,
  };
  constructor(private productService:ProductService, private router:Router) {}
  ngOnInit(): void {
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
    });
  }

  orderNow(data: { email: string, address: string, contact: string }) {
    let user = localStorage.getItem('user');
    let userobj = user && JSON.parse(user);
    let userId = userobj && userobj[0].id;
    if (this.priceSummary.total) {
      let orderData: Order = {
        ...data,
        totalPrice: this.priceSummary.total,
        userId,
        id: undefined
      }

      this.cartData?.forEach((item) => {
        setTimeout(() => {
          item.id && this.productService.deleteCartItems(item.id);
        }, 700)
      })

      this.productService.orderNow(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = "Order has been placed";
          setTimeout(() => {
            this.orderMsg = undefined;
            this.router.navigate(['/my-orders'])
          }, 4000);

        }

      })
    }
  }

}
