import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PerfumeComponent } from './components/perfume/perfume.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent,  data: { animation: 'HomeComponent' } },
    { path: 'perfumes', component: PerfumeComponent,  data: { animation: 'PerfumeComponent' }},
    { path: 'sign-up', component: SignUpComponent, data: { animation: 'SignUpComponent' }},
    { path: 'login', component: LoginComponent, data: { animation: 'LoginComponent' }},
    { path: 'cart', component: CartComponent, data: { animation: 'CartComponent' }},
    { path: 'search', component: SearchFilterComponent, data: { animation: 'SearchFilterComponent' }},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
