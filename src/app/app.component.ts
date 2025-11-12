import { Component } from '@angular/core';
import { ProductService } from './Services/product.service';
import { NavigationEnd,Router, RouterOutlet } from '@angular/router';
import { fader } from './route-animations';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrl: './app.component.css',
    animations: [fader]
})

export class AppComponent {
    title = 'perfumeCollection';

    username: string | null = null;

    confirmLogoutBtn = false

    name: string =''

     prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateUsername();

    // Update username whenever route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateUsername();
      }
    });
  }

  // ✅ Read username from sessionStorage
  updateUsername(): void {
    if (typeof window !== 'undefined') {
      console.log('updateUsername function')
      let name= sessionStorage.getItem('name');
      this.username  = name
      console.log(this.username, 'logged in')
    }
  }

  confirmLogout(): void {
    this.confirmLogoutBtn = true;
  }
  cancelLogout(): void {
    this.confirmLogoutBtn = false;
  }

  // ✅ Logout function
  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('uId');
      this.username = null;
      this.confirmLogoutBtn = false;
      this.router.navigate(['/login']); // redirect to login page
    }
  }
}
