import { NgModule } from '@angular/core';
import { LazyComponent } from './lazy.component';
import { routing } from './lazy.routing';
import { SharedModule } from '../app.sharedmodule';

@NgModule({
  imports: [
    routing,
    SharedModule.forRoot()
  ],
  declarations: [ LazyComponent]
})
export class LazyModule {}
