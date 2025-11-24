import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  credentials = {
    email: '',
    password: '',
    uId: ''
  };

  showToast: boolean = false;
  toastMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cartService: CartService
  ) {}

  // 🔥 Reusable Toast Function
  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

  onLogin() {
    // console.log('Attempting login:', this.credentials);

    this.userService.loginUser(this.credentials).subscribe({
      next: (response: any) => {
        // console.log('Login response:', response);

        if (!response || !response.userId) {
          this.showToastMessage('Login failed: Something went wrong.');
          return;
        }

        // Save user info in sessionStorage
        sessionStorage.setItem('uId', response.userId.toString());
        sessionStorage.setItem('name', response.name);

        // 🔥 Update cart count immediately
        this.cartService.getCartByUserId(response.userId).subscribe((cart: any[]) => {
          this.cartService.cartCount.next(cart.length);
          (this.cartService as any).cartUpdatedSource.next();
        });

        this.showToastMessage('Login successful!');
        setTimeout(() => this.router.navigate(['/home']), 500);
      },

      error: (err) => {
        // console.error('Login failed:', err);
        this.showToastMessage('Invalid email or password.');
      }
    });
  }
}
