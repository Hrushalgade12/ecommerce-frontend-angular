import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from 'src/data-type';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent implements OnInit {
  addProductMessage: string | undefined;
  public product: Product = new Product();
  constructor(
    private addProductService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getProductById(id);
    }
  }
  getProductById(id: string) {
    this.addProductService.getProductById(id).subscribe((result) => {
      this.product = result;
    });
  }
  submit() {
    if (this.product.id) {
      console.warn("First IF");
      this.addProductService.updateProduct(this.product).subscribe((result) => {
        console.warn(result);
        if (result) {
          this.addProductMessage = 'Product is successfully updated';
        }
        setTimeout(() => (this.addProductMessage = undefined), 3000);
      });
    } else {
      console.warn("2nd else");
      this.addProductService.addProduct(this.product).subscribe((result) => {
        console.warn(result);
        if (result) {
          this.addProductMessage = 'Product is successfully added';
        }
        setTimeout(() => (this.addProductMessage = undefined), 3000);
      });
    }
  }
}
