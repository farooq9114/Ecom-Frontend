import { Component } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: false,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent {
      constructor(private productService: ProductService, private router: Router){
        //this.productService.getProducts()
    }

    // Coupon state
    couponCode: string = 'FIRST10';
    copied: boolean = false;
    private resetTimeout: any;

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

    // Clipboard logic with fallback and robust handling
    copyCoupon() {
        const text = this.couponCode || 'FIRST10';

        // clear any pending timeout
        if (this.resetTimeout) { clearTimeout(this.resetTimeout); this.resetTimeout = null; }

            const writeText = () => {
              // set copied state for UI
              this.copied = true;
              // reset after 2s
              this.resetTimeout = setTimeout(() => { this.copied = false; }, 2000);
        };

        if (navigator && (navigator as any).clipboard && (navigator as any).clipboard.writeText) {
            (navigator as any).clipboard.writeText(text).then(() => {
              writeText();
            }).catch(() => {
              // fallback if clipboard API rejected
              this.fallbackCopy(text, writeText);
            });
        } else {
            this.fallbackCopy(text, writeText);
        }
    }

    private fallbackCopy(text: string, onSuccess: () => void) {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            // keep off-screen
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            ta.style.top = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            ta.setSelectionRange(0, ta.value.length);
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            if (ok) onSuccess();
            else {
              // last resort: show prompt so user can copy manually
              // (avoid using alert heavy UX)
              window.prompt('Copy coupon code:', text);
            }
        } catch (err) {
            console.error('copy fallback error', err);
            window.prompt('Copy coupon code:', text);
        }
    }

    goToPerfume() {
        this.router.navigate(['/perfumes']);
    }

    goToCombo(){
        this.router.navigate(['/combos']);
    }

}
