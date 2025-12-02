import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private baseUrl = 'https://springboot-6n6n.onrender.com/';


    constructor(private http: HttpClient) {}

    getProducts(): Observable<any[]> {
       return this.http.get<any[]>(`${this.baseUrl}perfume/getAll`);
    }

    getComboPerfume(): Observable<any[]> {
       return this.http.get<any[]>(`${this.baseUrl}combos/getAllCombos`);
    }


}
