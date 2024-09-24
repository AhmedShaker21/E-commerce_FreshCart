import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product/product.service';
import { Products } from '../../../shared/interfaces/products';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../shared/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../shared/services/category/category.service';
import { Category } from '../../../shared/interfaces/category';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit , OnDestroy {
  productList: Products[] = [];
  isLoading: boolean = false;
  getAllProducts !: Subscription;
  categoryData: Category[] = []

  constructor(private _productService: ProductService, private _cartService: CartService, private _toastrService: ToastrService , private _categoryService:CategoryService) { }
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('currentPage', '/home')
    }
    this.getAllProducts= this._productService.getAllProducts().subscribe({
      next: (res) => {
        console.log(res)
        this.productList= res.data

      },
      error: (err) => {
        console.log(err)
      }
    })
    this._categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryData = res.data
        console.log(this.categoryData)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  AddProduct(pID: string) {
    this.isLoading = true;
    return this._cartService.AddProductToCart(pID).subscribe({
      next: (res) => {
        console.log(res)
        this._toastrService.success(res.message);
        this.isLoading = false
        this._cartService.cartItem.next(res.numOfCartItems)
        console.log(res.numOfCartItems)
      }
    })
  }
  ngOnDestroy(): void {
    this.getAllProducts?.unsubscribe();
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
    },
    nav: true
  }
  customOptionsCat: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }


}
