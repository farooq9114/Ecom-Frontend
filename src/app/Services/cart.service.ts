import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

export interface Cart {
  cartId: number;
  uid: number;
  pid: number;
  name: string;
  description: string;
  gender: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

    private baseUrl = 'https://backend-zixw.onrender.com/cart';
    cartCount = new BehaviorSubject<number>(0);
    // cartUpdated$ = new Subject<void>();

    public cartUpdatedSource = new Subject<void>();   // <-- make it public
    cartUpdated$ = this.cartUpdatedSource.asObservable();


    // ✅ BehaviorSubject with safe sessionStorage check
  private initialCount = (() => {
    if (typeof window !== 'undefined') {
      return Number(sessionStorage.getItem('cartCount')) || 0;
    }
    return 0; // SSR fallback
  })();

    private cartCountSubject = new BehaviorSubject<number>(this.initialCount);
    cartCount$ = this.cartCountSubject.asObservable();

    constructor(private http: HttpClient) {}

    clearCart(uid: number): Observable<string> {
        return this.http.delete(`${this.baseUrl}/clear/${uid}`, {
          responseType: 'text',
        });
    }

    getCartByUserId(userId: number): Observable<Cart[]> {
        return this.http.get<Cart[]>(`${this.baseUrl}/getProdsByUserid/${userId}`);
    }

    addToCart(cartItem: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/addToCart`, cartItem).pipe(
            tap(() => this.cartUpdatedSource.next())
        );
    }

    updateCartItem(cartId: number, updatedItem: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/${cartId}`, updatedItem).pipe(
            tap(() => this.cartUpdatedSource.next())
        );
    }

    deleteCartItem(cartId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/deletePerfumeByCartid/${cartId}`).pipe(
            tap(() => this.cartUpdatedSource.next())
        );
    }

    // Call this when item added
    updateCartCount(count: number) {
        this.cartCount.next(count);
    }

    setCartCount(count: number) {
    this.cartCountSubject.next(count);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cartCount', String(count));
    }
  }
    resetCartCount() {
        this.setCartCount(0);
  }

}
