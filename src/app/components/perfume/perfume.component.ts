import { Component } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { CartService } from '../../Services/cart.service';
import { Router } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-perfume',
  standalone: false,
  templateUrl: './perfume.component.html',
  styleUrl: './perfume.component.css'
})
export class PerfumeComponent {

    constructor(
      private productService: ProductService,
      private router: Router,
      @Inject(PLATFORM_ID) private platformId: Object
    ){}

    selectedPriceRange: string = '';
    searchText: string = '';

    perfumes: any[] = []
    // ngOnInit(): void {
    //     this.productService.getProducts().subscribe((data) => {
    //         this.perfumes = data;
    //         this.filteredPerfumes = data;
    //         // console.log('Products received:', this.perfumes);
    //     });
    // }

    ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    this.productService.getProducts().subscribe((data) => {
      this.perfumes = data;
      this.filteredPerfumes = data;
    });
  }
}


    filteredPerfumes: any[] = [];
    searchGender: string = '';

    viewPerfumeDetails(id: number) {
        // console.log('id----------', id)
        this.router.navigate(['/perfume', id]);
    }

    filterPerfumes(): void {
        let filtered = this.perfumes;

        // Search filter
        if (this.searchText.trim() !== '') {
            const text = this.searchText.toLowerCase();
            filtered = filtered.filter((p) =>
              p.name.toLowerCase().includes(text) ||
              p.description.toLowerCase().includes(text)
            );
        }

        // Gender / Category Filter
        if (this.searchGender) {
            if (this.searchGender === "NewLaunch") {
                // ⭐ Show only latest launch
                    filtered = filtered.filter((p) => p.latestLaunch === true);
            } else {
                // Normal gender filtering
                filtered = filtered.filter(
                (p) => p.gender.toLowerCase() === this.searchGender.toLowerCase());
            }
        }

        // Price filter
        if (this.selectedPriceRange) {
            const [min, max] = this.selectedPriceRange.split('-').map(Number);
            filtered = filtered.filter((p) => p.price >= min && p.price <= max);
        }
        this.filteredPerfumes = filtered;
    }
}
