import { Component, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { fader } from './route-animations';
import { CartService } from './Services/cart.service';
import { Subscription } from 'rxjs';
declare var bootstrap: any;
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
  animations: [fader]
})
export class AppComponent  {

  title = 'perfumeCollection';

  username: string | null = null;
  confirmLogoutBtn = false;

  cartCount = 0;
  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private cartService: CartService) {}

  // ---------------------------------
  // 🔥 FIX: Animation hydration error
  // ---------------------------------
  ngAfterViewInit(): void {
    // Delay to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.safeUpdateUsername();
      this.safeLoadCartCount();
    }, 0);

    // Update on cart change
    this.subscription = this.cartService.cartUpdated$.subscribe(() => {
      this.safeLoadCartCount();
    });

    // Update username on navigation change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.safeUpdateUsername();
      }
    });
  }

  // --------------------------------------------------
  // 🔥 FIX: SSR-safe username load
  // --------------------------------------------------
  safeUpdateUsername(): void {
    if (typeof window === 'undefined') return;

    const name = window.sessionStorage.getItem('name');
    this.username = name;
  }

  // --------------------------------------------------
  // 🔥 FIX: SSR-safe cart count load
  // --------------------------------------------------
  safeLoadCartCount(): void {
    if (typeof window === 'undefined') {
      this.cartCount = 0;
      return;
    }

    const userIdStr = window.sessionStorage.getItem('uId');
    const userId = userIdStr ? parseInt(userIdStr, 10) : null;

    if (userId) {
      this.cartService.getCartByUserId(userId).subscribe({
        next: (items) => (this.cartCount = items.length),
        error: () => (this.cartCount = 0),
      });
    } else {
      this.cartCount = 0;
    }
  }

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  confirmLogout(): void {
    this.confirmLogoutBtn = true;
  }

  cancelLogout(): void {
    this.confirmLogoutBtn = false;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('name');
      window.sessionStorage.removeItem('uId');
      this.cartCount = 0;
      this.username = null;
      this.confirmLogoutBtn = false;
      this.router.navigate(['/login']);
    }
  }

  // --------------------------------------------------
  // Navbar collapse for mobile
  // --------------------------------------------------
  closeNavbar() {
  const nav = document.getElementById('navbarNav');
  if (nav) {
    const bsCollapse = bootstrap.Collapse.getInstance(nav);

    if (bsCollapse) {
      bsCollapse.hide();     // Close menu
    } else {
      // If no instance exists, create one (failsafe)
      new bootstrap.Collapse(nav, { toggle: false }).hide();
    }
  }
}


   // --------------------------------------------------
  // Route animation binder
  // --------------------------------------------------
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

toggleNavbar() {
  const nav = document.getElementById('navbarNav');
  if (nav) {
    let collapse = bootstrap.Collapse.getInstance(nav);

    if (!collapse) {
      collapse = new bootstrap.Collapse(nav, { toggle: false });
    }

    collapse.toggle(); // open if closed, close if open
  }
}

showFooter() {
  return this.router.url === '/home';
}

}
