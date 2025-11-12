import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cart {
  cartId: number;
  uid: number;
  pid: number;
  name: string;
  description: string;
  gender: string;
  price: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = 'http://192.168.1.17:8080/cart'; // ✅ backend base URL

  constructor(private http: HttpClient) {}

  getCartByUserId(userId: number): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}/getProdsByUserid/${userId}`);
  }

  addToCart(cartItem: any): Observable<any> {
        console.log("cartItem: ", cartItem)
    return this.http.post(`${this.baseUrl}/addToCart`, cartItem);
  }

  updateCartItem(cartId: number, updatedItem: any) {
    return this.http.put(`${this.baseUrl}/${cartId}`, updatedItem);
  }

   deleteCartItem(cartId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deletePerfumeByCartid/${cartId}`);
  }
}
