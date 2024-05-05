import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from 'src/data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchList: undefined | Product[];
  constructor(
    private actRoute: ActivatedRoute,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    let query = this.actRoute.snapshot.paramMap.get('query');
    query &&
      this.productService.searchProducts(query).subscribe((searchResult) => {
        this.searchList=searchResult;
      });
  }
}
