import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content.component';

const routes: Routes = [
  {
    path: "", component: ContentComponent, children: [
      { path: "home", loadChildren: () => import("../home/home.module").then(module => module.HomeModule) },
      { path: "caixa", loadChildren: () => import("../caixa/caixa.module").then(module => module.CaixaModule) },
      { path: "produtos", loadChildren: () => import('../produtos/produtos.module').then(module => module.ProdutosModule) },
      { path: "estoque", loadChildren: () => import('../estoque/estoque.module').then(module => module.EstoqueModule) },
      { path: "movimentacao-estoque", loadChildren: () => import('../movimentacoes/movimentacoes.module').then(module => module.MovimentacoesModule) },
      { path: "compras", loadChildren: () => import('../compras/compras.module').then(module => module.ComprasModule) },
      { path: "vendas", loadChildren: () => import('../vendas/vendas.module').then(module => module.VendasModule) },
      { path: "comandas", loadChildren: () => import('../comanda/comanda.module').then(module => module.ComandaModule) },
      {path: "clientes", loadChildren: () => import('../cliente/cliente.module').then(module => module.ClienteModule)}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }