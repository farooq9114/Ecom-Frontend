import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { response } from 'express';

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
  router: any;

  constructor(private userService: UserService) {}

  // onSubmit() {
  //   console.log('User Data:', this.user);
  //   this.userService.registerUser(this.user).subscribe({
  //     next: (response) => {
  //       console.log('Signup successful:', response);
  //       alert('Account created successfully!');
  //     },
  //     error: (err) => {
  //       console.error('Signup error:', err);
  //     }
  //   });
  // }

  onSubmit() {
    this.userService.registerUser(this.user).subscribe(
      (response) => {
        alert('Signup successful!');
        this.router.navigate(['/login']);
      },
      (error) => {
        alert('Email already exists or server error!');
      }
    );
  }

}
