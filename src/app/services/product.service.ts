import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Cart, Order, Product } from 'src/data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartData = new EventEmitter<Product[] | []>();
  currentData = new EventEmitter<Cart[] | []>();

  constructor(private http: HttpClient) {}

  addProduct(data: Product) {
    return this.http.post('http://localhost:8080/product/addProduct', data, {
      observe: 'response',
    });
  }

  deleteProduct(id: string) {
    return this.http.delete<Product>(`http://localhost:3000/products/${id}`);
  }
  productList() {
    return this.http.get<Product[]>('http://localhost:8080/product/getAll');
  }
  getProductById(id: string) {
    return this.http.get<Product>(`http://localhost:3000/products/${id}`);
  }
  updateProduct(product: Product) {
    console.log(product);
    return this.http.put(
      `http://localhost:3000/products/${product.id}`,
      product,
      {
        observe: 'response',
      }
    );
  }
  popularProducts() {
    return this.http.get<Product[]>('http://localhost:8080/product/getAll');
  }
  trendyProducts() {
    return this.http.get<Product[]>('http://localhost:8080/product/getAll');
  }
  searchProducts(query: string) {
    return this.http.get<Product[]>(
      `http://localhost:3000/products?q=${query}`
    );
  }
  localAddToCart(data: Product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }
    this.cartData.emit(cartData);
  }
  localDeleteToCart(id: string) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: Product[] = JSON.parse(cartData);
      items = items.filter((item: Product) => id !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }
  addUserProductToCart(cartData: Cart) {
    return this.http.post('http://localhost:3000/cart/', cartData, {
      observe: 'response',
    });
  }

  getCartList(userId: string) {
    return this.http
      .get<Product[]>('http://localhost:3000/cart?userId=' + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }
  removeFromCart(cartId: string) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }
  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore)[0];
    return this.http.get<Cart[]>(
      'http://localhost:3000/cart?userId=' + userData.id
    );
  }
  orderNow(orderData: Order) {
    return this.http.post('http://localhost:3000/orders', orderData);
  }
  deleteCartItems(cartId: string) {
    return this.http
      .delete('http://localhost:3000/cart/' + cartId)
      .subscribe((result) => {
        this.cartData.emit([]);
      });
  }
  cancelOrder(orderId: number) {
    return this.http.delete('http://localhost:3000/orders/' + orderId);
  }
  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore)[0];
    return this.http.get<Order[]>('http://localhost:3000/orders?userId=' + userData.id);
  }

}
