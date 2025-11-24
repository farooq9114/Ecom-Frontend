import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CartService } from '../../Services/cart.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-combos-detail',
  standalone: false,
  templateUrl: './combos-detail.component.html',
  styleUrl: './combos-detail.component.css'
})
export class CombosDetailComponent {
    perfume: any;
    relatedPerfumes: any[] = [];
    rating: number | null = null;

    toastMessage: string = '';
    showToast: boolean = false;

    isImageZoomed: boolean = false;

    openZoom() {
        this.isImageZoomed = true;
    }

    closeZoom() {
        this.isImageZoomed = false;
    }

    constructor(
      private route: ActivatedRoute,
      private productService: ProductService,
      private cartService: CartService,
      private router: Router,
      private location: Location
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(() => this.loadPerfume());
    }

    loadPerfume(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) return;
        this.productService.getComboPerfume().subscribe((data) => {
            this.perfume = data.find((p: any) => p.id === id);
            console.log('loaded perfumes- ',this.perfume)
            this.relatedPerfumes = data
              .filter((p: any) => p.gender === this.perfume.gender && p.id !== id)
              .slice(0, 4);
              console.log('related perfumes - ', this.relatedPerfumes)
            // 🎲 Generate random rating between 3 and 5
            this.rating = Math.floor(Math.random() * 3) + 3;
        });
    }

    goToPerfume(id: number): void {
        this.router.navigate(['/combos', id]).then(() => {
            this.loadPerfume(); // reload details for new perfume
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    addToCart(perfume: any) {
        const userIdStr = sessionStorage.getItem('uId');
        const userId = userIdStr ? parseInt(userIdStr, 10) : null;
        if (!userId) {
            this.showSuccessToast('Please login before adding items to cart.');
            return;
        }
        this.cartService.getCartByUserId(userId).subscribe({
            next: (cartItems: any[]) => {
                const existingItem = cartItems.find(
                    (item) => item.pId === perfume.id && item.producttype === 'combo'
                );
                console.log('existingItem ---------- ',existingItem)
                if (existingItem) {
                    this.showSuccessToast(`${perfume.name} is already in your cart`);
                    return;
                } else {
                  const cartItem = {
                    uId: userId,
                    pId: perfume.id,
                    name: perfume.name,
                    description: perfume.description,
                    producttype: 'combo',
                    gender: perfume.gender,
                    price: perfume.price,
                    imageUrl: perfume.imageurl,
                    quantity: 1,
                  };
                  this.cartService.addToCart(cartItem).subscribe({
                    next: () => {
                        console.log('Added to cart'),
                        this.showSuccessToast(`${perfume.name} added to cart successfully`);
                    },
                    error: (err) => {
                      console.error('Error adding to cart:', err);
                      this.showSuccessToast('Failed to add to cart');
                    }});
                }
            },
            error: (err) => console.error('Error fetching cart:', err),
        });
    }

    goBack(): void {
        this.location.back();
    }

    showSuccessToast(message: string) {
        this.toastMessage = message;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 2500);
    }
}
