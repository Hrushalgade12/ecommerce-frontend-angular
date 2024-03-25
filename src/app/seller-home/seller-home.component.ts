import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from 'src/data-type';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | Product[];
  product: Product[];
  icon = faTrash;
  editIcon=faPenToSquare;
  deleteProductMsg: string | undefined;
  constructor(private productService: ProductService, private router:Router) {}
  ngOnInit(): void {
    this.reloadList();
  }
  deleteProduct(id: string) {
    try {
      this.productService.deleteProduct(id).subscribe((result) => {
        console.warn("CLICKED"+result);
        if (result) {
          this.deleteProductMsg = 'Product is deleted';
        }
        setTimeout(() => (this.deleteProductMsg = undefined), 3000);
      });
      this.reloadList();
    } catch (error:any) {
      console.warn("Error "+error.message);
    }
 
  }

  reloadList(){
    this.productService.productList().subscribe((result) => {
      this.productList = result;
    });
  }
 
  updateProduct(id:string){
this.router.navigate([`/seller-add-product/${id}`]);
  }
}
