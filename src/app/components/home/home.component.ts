import { Component } from '@angular/core';
import { ProductService } from '../../Services/product.service';

@Component({
    selector: 'app-home',
    standalone: false,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})

export class HomeComponent {
      constructor(private productService: ProductService){
        //this.productService.getProducts()
    }

    perfumes: any[] = []

    ngOnInit(): void {
        this.productService.getProducts().subscribe((data) => {
            this.perfumes = data;
            this.filteredPerfumes = data;
            // console.log('Products received:', this.perfumes);
        });
    }

    filteredPerfumes: any[] = [];
    searchGender: string = '';

    filterPerfumes() {
        const search = this.searchGender.trim().toLowerCase();

        if (search === '') {
            this.filteredPerfumes = this.perfumes; // show all if search empty
        } else {
            this.filteredPerfumes = this.perfumes.filter(
            (p) => p.gender.toLowerCase()===search
          );
        }
    }

    addToCart(perfume: any){
        console.log("Added to cart", perfume)
    }

}
