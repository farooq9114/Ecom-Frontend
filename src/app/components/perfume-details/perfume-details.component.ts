import { Component, OnInit ,Inject, PLATFORM_ID} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { CartService } from '../../Services/cart.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-perfume-details',
  standalone: false,
  templateUrl: './perfume-details.component.html',
  styleUrls: ['./perfume-details.component.css']
})
export class PerfumeDetailsComponent implements OnInit {

  perfume: any;
  relatedPerfumes: any[] = [];
  rating: number | null = null;

  isImageZoomed: boolean = false;

  showToast: boolean = false;
  toastMessage: string = '';

  // ✅ Subscription container
  private subs = new Subscription();

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
      private location: Location,
      @Inject(PLATFORM_ID) private platformId: Object
  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit(): void {
    this.subs.add(
    this.route.paramMap.subscribe(params => {

      this.loadPerfume();

    })
  );

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 0);
  }

  ngOnDestroy(): void {
      // 🧹 Clean all subscriptions → FIXES your WARNING
      this.subs.unsubscribe();
      // console.log('PerfumeDetailsComponent destroyed - all subscriptions cleared');
  }

  loadPerfume(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  if (!id) return;

  this.productService.getProducts().subscribe((data) => {
    this.perfume = data.find((p: any) => p.id === id);

    if (!this.perfume) {
    //   console.error("Perfume not found for ID:", id);
      this.router.navigate(['/not-found']);
      return;
    }

    this.relatedPerfumes = data
      .filter((p: any) => p.gender === this.perfume.gender && p.id !== id)
      .slice(0, 4);

    this.rating = Math.floor(Math.random() * 3) + 3;
  });
}

  goToPerfumeCard(event: any, id: number) {
  event.currentTarget.classList.add('card-click-animate');

  setTimeout(() => {
    this.router.navigate(['/perfume', id]);
  }, 250);
}

  addToCart(perfume: any) {
    const userIdStr = sessionStorage.getItem('uId');
    const userId = userIdStr ? parseInt(userIdStr, 10) : null;

    if (!userId) {
    //   this.showSuccessToast('Please login before adding items to cart.');
      this.showSuccessToast('Please login before adding items to cart.');
      return;
    }

    this.cartService.getCartByUserId(userId).subscribe({
      next: (cartItems: any[]) => {
        const existingItem = cartItems.find(
            (item) => item.pId === perfume.id && item.producttype === 'perfume'
        );

        if (existingItem) {
          this.showSuccessToast(`${perfume.name} is already in your cart`);
          return;
        } else {
          const cartItem = {
            uId: userId,
            pId: perfume.id,
            name: perfume.name,
            producttype: 'perfume',
            description: perfume.description,
            gender: perfume.gender,
            price: perfume.price,
            imageUrl: perfume.imageUrl,
            quantity: 1,
          };
          this.cartService.addToCart(cartItem).subscribe({
            next: () => {
            //   console.log('Added to cart', cartItem),
              this.showSuccessToast(`${perfume.name} added to cart successfully`);
            },
            error: (err) => {
            //   console.error('Error adding to cart:', err);
              this.showSuccessToast('Failed to add to cart');
            },
          });
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
    }, 2500); // hide after 2 sec
  }
}
