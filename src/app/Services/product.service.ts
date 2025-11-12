import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private baseUrl = 'http://192.168.1.17:8080/perfume';

    constructor(private http: HttpClient) {}

    getProducts(): Observable<any[]> {
       return this.http.get<any[]>(`${this.baseUrl}/getAll`);
    }

}
