import { Component } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { Router } from '@angular/router';

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
    storedUserId: string | null = '';
    couponCode: string = '';
    discount: number = 0;
    couponError: string = '';
    grandTotal: number = 0;
    showToast = false;
    toastMessage = '';

    constructor(private cartService: CartService, private router: Router) {}

    ngOnInit(): void {

        // ✅ Fetch userId from localStorage
        this.storedUserId = sessionStorage.getItem('uId');
        // console.log('---------------------',this.storedUserId)
        this.calculateTotal();
        if (this.storedUserId) {
            this.userId = parseInt(this.storedUserId, 10);
            this.isLoggedIn = true;
            this.loadCartItems();
        } else {
            this.isLoggedIn = false;
        }

        if (!this.storedUserId) {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }
    }

    //display cart item on the screen
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
                // console.error('Error loading cart items:', err);
            }
        });
    }

    //Total amount while check out
    calculateTotal(): void {
        const subtotal = this.cartItems.reduce((sum: number, item: any) => {
            const qty = item.quantity ?? 1;
            return sum + item.price * qty;
        }, 0);

        // 🔥 Recalculate discount dynamically if coupon is active
        if (this.couponCode.trim().toUpperCase() === 'FIRST10' && subtotal > 0) {
            this.discount = subtotal * 0.10;
        } else {
            this.discount = 0;
        }

        this.total = subtotal - this.discount;
        this.grandTotal = this.total;
    }

    //Remove coupon logic
    removeCoupon(): void {
        this.couponCode = '';
        this.discount = 0;
        this.couponError = '';

        // Recalculate total without applying coupon
        this.calculateTotal();
    }

    //Apply coupon
    applyCoupon(): void {
        this.couponError = '';
        this.discount = 0;
        // console.log('in applyCoupon function ------------')
        if (!this.couponCode || this.couponCode.trim() === '') {
          this.couponError = 'Please enter a coupon code.';
          return;
        }
        // console.log('after first condition')
        const code = this.couponCode.trim().toUpperCase();

        if (code === 'FIRST10') {
            // console.log(code)
          // 10% discount
          const subtotal = this.cartItems.reduce((sum: number, item: any) => {
            const qty = item.quantity ?? 1;
            return sum + item.price * qty;
          }, 0);

          this.discount = subtotal * 0.10; // 10% off
          this.total = subtotal - this.discount;
        //   console.log('totatl - ', this.total)

          this.couponError = '';
        } else {
          this.couponError = 'Invalid Coupon Code ❌';
          this.discount = 0;
        }
    }

    toggleCoupon() {
  if (this.discount > 0) {
    // Coupon is already applied → remove it
    this.removeCoupon();
  } else {
    // Try applying coupon
    this.applyCoupon();
  }
}

    applySuggestedCoupon() {
        this.couponCode = 'FIRST10';
        this.applyCoupon();
        this.showSuccessToast("🎉 Coupon FIRST10 applied!");
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
                // console.error('Error updating quantity:', err);
                // alert('Failed to update quantity.');
            }
        });
    }

    //remove particular item from the cart
    removeItem(cartId: number): void {
        // if (!confirm('Are you sure you want to remove this item?')) return;
        this.cartService.deleteCartItem(cartId).subscribe({
            next: () => {
                // Remove from frontend after successful delete
                this.cartItems = this.cartItems.filter((item: { cartId: number; }) => item.cartId !== cartId);
                this.calculateTotal();
            },
            error: (err) => {
                // console.error('Error deleting item:', err);
                this.showSuccessToast('Failed to delete item from cart.');
            }
        });
    }


     // 🔥 **Trigger from modal**
  confirmClearCart() {

      (document.activeElement as HTMLElement)?.blur();

  // ⭐ FIX 2: Hide modal safely (works with TypeScript)
  const modalElement = document.getElementById('clearCartModal');
  if (modalElement) {
    const bootstrapModal = (window as any).bootstrap?.Modal.getInstance(modalElement)
      || new (window as any).bootstrap.Modal(modalElement);

    bootstrapModal.hide();
  }

    if (!this.userId) {
      this.showSuccessToast('⚠️ Please log in to clear the cart.');
      return;
    }

    this.cartService.clearCart(this.userId).subscribe({
      next: () => {
        this.cartItems = [];
        this.total = 0;
        this.showSuccessToast('🗑️ Cart cleared successfully!');
        this.cartService.setCartCount(0);
        this.cartService.cartUpdatedSource.next();
      },
      error: () => {
        this.showSuccessToast('❌ Failed to clear cart.');
      }
    });
  }


    //Toast msg whenever a product is added
    showSuccessToast(msg: string) {
        this.toastMessage = msg;
        this.showToast = true;

        setTimeout(() => {
          this.showToast = false;
        }, 3500);
    }

}
