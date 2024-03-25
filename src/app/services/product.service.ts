import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  addProduct(data: Product) {
    return this.http.post('http://localhost:3000/products/', data, {
      observe: 'response',
    });
  }

  deleteProduct(id: string ) {
     return this.http.delete<Product>(`http://localhost:3000/products/${id}`);
  }
  productList() {
    return this.http.get<Product[]>('http://localhost:3000/products/');
  }
  getProductById(id: string ) {
    return this.http.get<Product>(`http://localhost:3000/products/${id}`);
  }
  updateProduct(product:Product){
    console.log(product);
    return this.http.put(`http://localhost:3000/products/${product.id}`, product, {
      observe: 'response',
    });
  }
}
