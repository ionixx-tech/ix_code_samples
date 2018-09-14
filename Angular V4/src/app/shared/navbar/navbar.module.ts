import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import {AppComponent} from '../../app.component';

@NgModule({
    imports: [ RouterModule, CommonModule , FormsModule],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ],
    providers : [AppComponent]
})

export class NavbarModule {}
