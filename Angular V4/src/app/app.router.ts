import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';



export const router: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', loadChildren: './authentication/authentication.module#AuthenticationModule'},
  { path: '**', redirectTo: 'error' }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router, { useHash: true });
