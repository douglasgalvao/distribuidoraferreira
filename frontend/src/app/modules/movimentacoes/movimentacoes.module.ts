import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimentacoesComponent } from './movimentacoes.component';
import { MovimentacoesRoutingModule } from './movimentacoes-routing.module';
import { MaterialModule } from '../../material-module';
import { SharedModule } from '../../modules/shared/shared.module';
import { MovimentacoesListaComponent } from './movimentacoes-lista/movimentacoes-lista.component';
import { DialogNovaMovimentacaoComponent } from './dialog-nova-movimentacao/dialog-nova-movimentacao.component';



@NgModule({
  declarations: [
    MovimentacoesComponent,
    MovimentacoesListaComponent,
    DialogNovaMovimentacaoComponent,
  ],
  imports: [
    CommonModule,
    MovimentacoesRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class MovimentacoesModule { }
