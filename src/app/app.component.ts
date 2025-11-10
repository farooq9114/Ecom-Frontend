import { Component } from '@angular/core';
import { ProductService } from './Services/product.service';
import { NavigationEnd,Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrl: './app.component.css'
})

export class AppComponent {
    title = 'perfumeCollection';

    username: string | null = null;

    name: string =''

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

  // ✅ Logout function
  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('uId');
      this.username = null;
      this.router.navigate(['/login']); // redirect to login page
    }
  }
}
