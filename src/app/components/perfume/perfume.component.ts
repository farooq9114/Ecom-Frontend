import { Component } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-perfume',
  standalone: false,
  templateUrl: './perfume.component.html',
  styleUrl: './perfume.component.css'
})
export class PerfumeComponent {

    constructor(private productService: ProductService, private cartService: CartService){}

    selectedPriceRange: string = '';

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

    filterPerfumes(): void {
        let filtered = this.perfumes;

        // Gender filter
        if (this.searchGender) {
          filtered = filtered.filter(
            (p) => p.gender.toLowerCase() === this.searchGender.toLowerCase()
          );
        }

        // Price filter
        if (this.selectedPriceRange) {
          const [min, max] = this.selectedPriceRange.split('-').map(Number);
          filtered = filtered.filter((p) => p.price >= min && p.price <= max);
        }

        this.filteredPerfumes = filtered;
    }

   addToCart(perfume: any) {
  console.log("Pefume You selected: ", perfume);

  const userIdStr = sessionStorage.getItem('uId');
  const userId = userIdStr ? parseInt(userIdStr, 10) : null;

  if (!userId) {
    alert('Please login before adding items to cart.');
    return;
  }

  // First, get user's existing cart
  this.cartService.getCartByUserId(userId).subscribe({
    next: (cartItems: any[]) => {
      // Check if perfume already exists
      const existingItem = cartItems.find((item) => item.pId === perfume.id);

      if (existingItem) {
        // Update quantity
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + 1
        };

        this.cartService.updateCartItem(updatedItem.cartId, updatedItem).subscribe({
          next: () => alert(`Increased quantity of ${perfume.name}`),
          error: (err) => console.error('Error updating cart:', err)
        });
      } else {
        // Add as new item
        const cartItem = {
          uId: userId,
          pId: perfume.id,
          name: perfume.name,
          description: perfume.description,
          gender: perfume.gender,
          price: perfume.price,
          imageUrl: perfume.imageUrl,
          quantity: 1
        };

        this.cartService.addToCart(cartItem).subscribe({
          next: () => alert('Added to cart successfully!'),
          error: (err) => {
            console.error('Error adding to cart:', err);
            alert('Failed to add to cart.');
          }
        });
      }
    },
    error: (err) => console.error('Error fetching cart:', err)
  });
}

}
