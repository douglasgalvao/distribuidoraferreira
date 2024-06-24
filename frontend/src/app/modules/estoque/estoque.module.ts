import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstoqueComponent } from './estoque.component';
import { EstoqueRoutingModule } from './estoque-routing.module';
import { MaterialModule } from '../../material-module';
import { SharedModule } from '../shared/shared.module';
import { ProdutoEstoqueComponent } from './produto-estoque/produto-estoque.component';
import { DefinirEstoqueDialogComponent } from './definir-estoque-dialog/definir-estoque-dialog.component';



@NgModule({
  declarations: [
    EstoqueComponent,
    ProdutoEstoqueComponent,
    DefinirEstoqueDialogComponent
  ],
  imports: [
    CommonModule,
    EstoqueRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class EstoqueModule { }
