import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from 'src/app/material-module';
import { SpinnerDefaultComponent } from './spinner-default/spinner-default.component';


@NgModule({
  declarations: [
    ToolbarComponent,
    SpinnerDefaultComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    ToolbarComponent,
    SpinnerDefaultComponent
  ]
})
export class SharedModule { }
