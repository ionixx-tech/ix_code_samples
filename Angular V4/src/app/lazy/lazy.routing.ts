import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LazyComponent } from './lazy.component';
import {AuthGuard} from '../guard/auth.guard';


const routes: Routes = [
  { path: '', component: LazyComponent , /* canActivate: [AuthGuard]*/ },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
