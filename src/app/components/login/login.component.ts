import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';

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
    uId:''
  };

  constructor(private userService: UserService, private router: Router) {}

 onLogin() {
  console.log('Attempting login:', this.credentials);

  this.userService.loginUser(this.credentials).subscribe({
    next: (response: any) => {
      console.log('Login response:', response); // 👈 check backend JSON here

      if (!response || !response.userId) {
        alert('Login failed: userId missing from response.');
        return;
      }

      // ✅ Save userId and userName
      sessionStorage.setItem('uId', response.userId.toString());
      sessionStorage.setItem('name', response.name);

      alert('Login successful!');
      this.router.navigate(['/home']);
    },
    error: (err) => {
      console.error('Login failed:', err);
      alert('Invalid email or password.');
    }
  });
}
}
