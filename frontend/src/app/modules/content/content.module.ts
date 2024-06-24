import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { MaterialModule } from 'src/app/material-module';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { ContentRoutingModule } from './content-routing.module';
import { ProdutosModule } from '../produtos/produtos.module';
import { EstoqueModule } from '../estoque/estoque.module';
import { MovimentacoesModule } from '../movimentacoes/movimentacoes.module';
import { ComprasModule } from '../compras/compras.module';
import { VendasModule } from '../vendas/vendas.module';
import { DialogVendasPendentesComponent } from './menu-bar/dialog-vendas-pendentes/dialog-vendas-pendentes.component';
import { CaixaModule } from '../caixa/caixa.module';
import { HomeModule } from '../home/home.module';
import { ClienteModule } from '../cliente/cliente.module';




@NgModule({
  declarations: [
    ContentComponent,
    MenuBarComponent,
    MenuLateralComponent,
    DialogVendasPendentesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ContentRoutingModule,
    HomeModule,
    ProdutosModule,
    EstoqueModule,
    ComprasModule,
    MovimentacoesModule,
    VendasModule,
    CaixaModule,
    ClienteModule
  ]
})
export class ContentModule { }
