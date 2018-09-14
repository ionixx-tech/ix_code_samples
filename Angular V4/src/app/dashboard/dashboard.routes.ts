import { Route } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from '../guard/auth.guard';

export const MODULE_ROUTES: Route[] = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
]

export const MODULE_COMPONENTS = [
    DashboardComponent,
    HomeComponent
]
