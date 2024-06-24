import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosComponent } from './produtos.component';
import { MaterialModule } from 'src/app/material-module';
import { DialogNovoProdutoComponent } from './dialog-novo-produto/dialog-novo-produto.component';
import { SharedModule } from '../shared/shared.module';
import { DialogNovaCategoriaComponent } from './dialog-nova-categoria/dialog-nova-categoria.component';
import { ProdutosRoutingModule } from './produtos-routing.module';
import { TableProdutosCategoriasComponent } from './table-pagination-produto/table-pagination-produto.component';
import { TableCategoriasProdutosComponent } from './table-pagination-categoria/table-pagination-categoria.component';
import { DialogEditProdutoComponent } from './dialog-edit-produto/dialog-edit-produto.component';
import { DialogDeleteProdutoComponent } from './dialog-delete-produto/dialog-delete-produto.component';
import { DialogDeleteCategoriaComponent } from './dialog-delete-categoria/dialog-delete-categoria.component';


@NgModule({
  declarations: [
    ProdutosComponent,
    DialogNovoProdutoComponent,
    TableProdutosCategoriasComponent,
    TableCategoriasProdutosComponent,
    DialogEditProdutoComponent,
    DialogNovaCategoriaComponent,
    DialogDeleteProdutoComponent,
    DialogDeleteCategoriaComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ProdutosRoutingModule
  ]
})
export class ProdutosModule { }
