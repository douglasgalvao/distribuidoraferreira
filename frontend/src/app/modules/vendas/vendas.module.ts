import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module';
import { SharedModule } from '../shared/shared.module';
import { VendasRoutingModule } from './vendas-routing.module';
import { VendasComponent } from './vendas.component';
import { DialogNovaVendaComponent } from './dialog-nova-venda/dialog-nova-venda.component';
import { TablePaginationVendasComponent } from './table-pagination-vendas/table-pagination-vendas.component';
import { DialogDetalhesVendaComponent } from './dialog-detalhes-venda/dialog-detalhes-venda.component';



@NgModule({
  declarations: [
    VendasComponent,
    DialogNovaVendaComponent,
    DialogDetalhesVendaComponent,
    TablePaginationVendasComponent
  ],
  imports: [
    CommonModule,
    VendasRoutingModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    TablePaginationVendasComponent
  ]
})
export class VendasModule { }
