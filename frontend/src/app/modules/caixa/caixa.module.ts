import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaixaComponent } from './caixa.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from 'src/app/material-module';
import { CaixaRoutingModule } from './caixa-routing.module';
import { BalanceComponent } from './balance/balance.component';
import { VendasModule } from '../vendas/vendas.module';
import { DialogSetValorInitCaixaComponent } from './dialog-set-valor-init-caixa/dialog-set-valor-init-caixa.component';
import { DialogSetCloseCaixaComponent } from './dialog-set-close-caixa/dialog-set-close-caixa.component';
import { TablePaginationCaixaComponent } from './table-pagination-caixa/table-pagination-caixa.component';
import { DetailsCaixaComponent } from './table-pagination-caixa/details-caixa/details-caixa.component';


@NgModule({
  declarations: [
    CaixaComponent,
    BalanceComponent,
    DialogSetValorInitCaixaComponent,
    DialogSetCloseCaixaComponent,
    TablePaginationCaixaComponent,
    DetailsCaixaComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CaixaRoutingModule,
    SharedModule,
    VendasModule
  ]
})
export class CaixaModule { }
