import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './error.component';
import {AuthGuard} from '../guard/auth.guard';


const routes: Routes = [
  { path: '', component: ErrorComponent , /* canActivate: [AuthGuard]*/ },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
