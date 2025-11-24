import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
    user = {
    name: '',
    email: '',
    password: '',
    address: '',
    mobile:'' ,
  };

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    // console.log('User before submit:', this.user);
    this.userService.registerUser(this.user).subscribe(
      (response) => {
        this.showToastMessage('Signup successful!');
        // this.router.navigate(['/login']);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      (error) => {
        // console.log(this.user)
        alert('Email already exists or server error!');
      });
  }

   showToast: boolean = false;
  toastMessage: string = '';

  // 🔥 Reusable Toast Function
  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

}
