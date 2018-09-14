import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { routing } from './error.routing';
import { SharedModule } from '../app.sharedmodule';

@NgModule({
  imports: [
    routing,
    SharedModule.forRoot()
  ],
  declarations: [ ErrorComponent]
})
export class ErrorModule {}
