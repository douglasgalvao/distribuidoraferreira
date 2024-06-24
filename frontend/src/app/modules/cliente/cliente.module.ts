import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from 'src/app/material-module';
import { BalanceComponent } from './balance/balance.component';
import { VendasModule } from '../vendas/vendas.module';
import { ClienteComponent } from './cliente.component';
import { ClienteRoutingModule } from './cliente-routing.module';
import { TablePaginationClientesComponent } from './table-pagination-clientes/table-pagination-clientes.component';
import { DialogNovoClienteComponent } from './dialog-novo-cliente/dialog-novo-cliente.component';
import { DetalhesClienteComponent } from './detalhes-cliente/detalhes-cliente.component';
import { TablePaginationVendasClientesComponent } from './detalhes-cliente/table-pagination-vendas-clientes/table-pagination-vendas-clientes.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { PhoneFormatPipe } from './table-pagination-clientes/phone.pipe';
import { DialogConfirmarPagamentoComponent } from './detalhes-cliente/table-pagination-vendas-clientes/dialog-confirmar-pagamento/dialog-confirmar-pagamento.component';
import { AlterarInfosClienteComponent } from './dialog-alterar-infos-cliente/dialog-alterar-infos-cliente.component';


@NgModule({
  declarations: [
    ClienteComponent,
    BalanceComponent,
    TablePaginationClientesComponent,
    DialogNovoClienteComponent,
    DetalhesClienteComponent,
    TablePaginationVendasClientesComponent,
    PhoneFormatPipe,
    DialogConfirmarPagamentoComponent,
    AlterarInfosClienteComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ClienteRoutingModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
    VendasModule
  ],
  providers: [provideNgxMask()]
})
export class ClienteModule { }

