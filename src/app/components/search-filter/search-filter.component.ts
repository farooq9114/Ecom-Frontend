import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { ProductService } from '../../Services/product.service';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-search-filter',
  standalone: false,
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css'
})
export class SearchFilterComponent {

  perfumes: any[] = [];
  filteredPerfumes: any[] = [];

  searchName: string = '';
  searchGender: string = '';
  selectedPriceRange: string = '';

  constructor(private perfumeService: ProductService, private userService: UserService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadAllPerfumes();
  }

  loadAllPerfumes(): void {
    this.perfumeService.getProducts().subscribe({
      next: (data) => {
        this.perfumes = data;
        this.filteredPerfumes = data;
      },
      error: (err) => console.error('❌ Error fetching perfumes:', err),
    });
  }

  applyFilters(): void {
    // console.log('---Entered in applyFilters method')
    let filtered = [...this.perfumes];
    // console.log('Filtered ---------------',filtered)

    // 🔹 Filter by name
    if (this.searchName.trim()) {
      // console.log("You searched for",this.searchName)
      const name = this.searchName.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(name));
      this.filteredPerfumes = filtered
      // console.log('Result-', filtered)
    }
  }

}
