import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Cart, Product } from 'src/data-type';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  productDetails: undefined | Product;
  productInCart: undefined | Product;
  productQuantity: number = 1;
  removeCart = false;
  cartData: Product | undefined;
  constructor(
    private act: ActivatedRoute,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    let productId = this.act.snapshot.paramMap.get('id');
    productId &&
      this.productService.getProductById(productId).subscribe((productData) => {
        this.productDetails = productData;
      });

    let cartData = localStorage.getItem('localCart');
    if (productId && cartData) {
      let items = JSON.parse(cartData);
      items = items.filter((item: Product) => productId == item.id.toString());
      if (items.length) {
        this.removeCart = true;
      } else {
        this.removeCart = false;
      }
    }
    let user = localStorage.getItem('user');
    let userobj = user && JSON.parse(user);

    if (userobj) {
      let userId = userobj && userobj[0].id;
      console.warn(userId);
      this.productService.getCartList(userId);
      this.productService.cartData.subscribe((result) => {
        let item = result.filter(
          (item: Product) => productId?.toString() === item.id
        );
        if (item.length) {
          this.cartData = item[0];
          this.removeCart = true;
        }
      });
    }
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }
  addProductsToCart(productDetails: Product) {
    this.productInCart = productDetails;
    this.productInCart.quantity = this.productQuantity;
    if (!localStorage.getItem('user')) {
      this.productService.localAddToCart(this.productInCart);
      this.removeCart = true;
    } else {
      let user = localStorage.getItem('user');
      let userobj = user && JSON.parse(user);
      console.warn(userobj);
      let userId = userobj && userobj[0].id;
      console.warn(userId);
      let cartData: Cart = {
        ...this.productInCart,
        userId,
        productId: this.productInCart.id,
      };

      this.productService.addUserProductToCart(cartData).subscribe((result) => {
        console.warn(result);
        if (result) {
          this.productService.getCartList(userId);
          this.removeCart = true;
        }
      });
    }
  }
  removeProductsFromCart(id: string) {
    if (!localStorage.getItem('user')) {
      this.productService.localDeleteToCart(id);
      this.removeCart = false;
    } else {
      let user = localStorage.getItem('user');
      let userobj = user && JSON.parse(user);
      let userId = userobj && userobj[0].id;
    
      this.cartData &&
        this.productService
          .removeFromCart(this.cartData.id)
          .subscribe((result) => {
            if (result) {
              this.productService.getCartList(userId);
            }
          });
          this.removeCart = false;
    }
  }
}
