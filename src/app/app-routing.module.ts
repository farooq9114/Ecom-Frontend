import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PerfumeComponent } from './components/perfume/perfume.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { PerfumeDetailsComponent } from './components/perfume-details/perfume-details.component';
import { CombosComponent } from './components/combos/combos.component';
import { CombosDetailComponent } from './components/combos-detail/combos-detail.component';

const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent,  data: { animation: 'HomeComponent' } },
    { path: 'perfumes', component: PerfumeComponent,  data: { animation: 'PerfumeComponent' }},
    { path: 'sign-up', component: SignUpComponent, data: { animation: 'SignUpComponent' }},
    { path: 'login', component: LoginComponent, data: { animation: 'LoginComponent' }},
    { path: 'cart', component: CartComponent, data: { animation: 'CartComponent' }},
    { path: 'search', component: SearchFilterComponent, data: { animation: 'SearchFilterComponent' }},
    { path: 'perfume/:id', component: PerfumeDetailsComponent },
    { path: 'combos', component: CombosComponent,  data: { animation: 'CombosComponent' }},
    { path: 'combos/:id', component: CombosDetailComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 0],
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }