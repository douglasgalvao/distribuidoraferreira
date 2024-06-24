import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from 'src/app/material-module';
import { DialogActionComponent } from './dialog-buttons/actions-buttons-home.component';
@NgModule({
  declarations: [
    HomeComponent,
    DialogActionComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    MatButtonModule,
    SharedModule
  ]
})
export class HomeModule { }
