import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComprasComponent } from './compras.component';
import { ComprasRoutingModule } from './compras-routing.module';
import { MaterialModule } from '../../material-module';
import { SharedModule } from '../shared/shared.module';
import { TableComprasComponent } from './table-pagination-compras/table-pagination-compras.component';
import { DialogNovaCompraComponent } from './dialog-nova-compra/dialog-nova-compra.component';
import { DialogDetalhesCompraComponent } from './dialog-detalhes-compra/dialog-detalhes-compra.component';



@NgModule({
  declarations: [
    ComprasComponent,
    TableComprasComponent,
    DialogNovaCompraComponent,
    DialogDetalhesCompraComponent
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class ComprasModule { }