import { Component } from '@angular/core';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any = [];
  userId: number | null = null;
  total: number = 0;
  isLoggedIn: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // ✅ Fetch userId from localStorage
    const storedUserId = sessionStorage.getItem('uId');

    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
      this.isLoggedIn = true;
      this.loadCartItems();
    } else {
      this.isLoggedIn = false;
    }
  }

   loadCartItems(): void {
    if (this.userId === null) {
      console.warn('No userId found, cannot load cart.');
      return;
    }

    this.cartService.getCartByUserId(this.userId).subscribe({
      next: (data) => {
        this.cartItems = data;
        this.calculateTotal();
      },
      error: (err) => {
        console.error('Error loading cart items:', err);
      }
    });
  }

  calculateTotal(): void {
  this.total = this.cartItems.reduce((sum: number, item: any) => {
    const quantity = item.quantity ?? 1;
    return sum + item.price * quantity;
  }, 0);
}

    // Add method to update quantity manually
updateQuantity(item: any, newQty: number): void {
  if (newQty < 1) return;

  const updatedItem = { ...item, quantity: newQty };

  this.cartService.updateCartItem(item.cartId, updatedItem).subscribe({
    next: () => {
      item.quantity = newQty;
      this.calculateTotal();
    },
    error: (err) => {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity.');
    }
  });
}

   removeItem(cartId: number): void {
    if (!confirm('Are you sure you want to remove this item?')) return;

    this.cartService.deleteCartItem(cartId).subscribe({
      next: () => {
        // Remove from frontend after successful delete
        this.cartItems = this.cartItems.filter((item: { cartId: number; }) => item.cartId !== cartId);
        this.calculateTotal();
      },
      error: (err) => {
        console.error('Error deleting item:', err);
        alert('Failed to delete item from cart.');
      }
    });
  }

}
