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
    console.log('---Entered in applyFilters method')
    let filtered = [...this.perfumes];
    console.log('Filtered ---------------',filtered)

    // 🔹 Filter by name
    if (this.searchName.trim()) {
      console.log("You searched for",this.searchName)
      const name = this.searchName.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(name));
      this.filteredPerfumes = filtered
      console.log('Result-', filtered)
    }
  }

     // ✅ Add to Cart functionality
  addToCart(perfume: any): void {
    const uid = this.userService.getUserId(); // Get logged-in user ID
    console.log('🧠 Current UID:', uid);

    if (!uid) {
      alert('⚠ Please log in to add items to your cart.');
      return;
    }

    const cartItem = {
      uid: Number(uid),
      id: perfume.pId || perfume.id,
      name: perfume.name,
      description: perfume.description,
      gender: perfume.gender,
      price: perfume.price,
      imageUrl: perfume.imageUrl,
    };

    this.cartService.addToCart(cartItem).subscribe({
      next: (response) => {
        console.log('✅ Added to cart:', response);
        alert('✅ Perfume added to cart successfully!');
      },
      error: (error) => {
        console.error('❌ Error adding to cart:', error);
        alert('❌ Failed to add perfume to cart.');
      },
    });
  }
}
