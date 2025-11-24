import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private baseUrl = 'http://192.168.1.32:8080/user';

    constructor(private http: HttpClient) {}

   registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/new-user`, userData);
  }

  loginUser(credentials: any): Observable<any> {
    console.log('From service layer: ', credentials)
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  getUserId(): number | null {
    const uid = sessionStorage.getItem('uId');
    return uid ? Number(uid) : null;
  }
}
