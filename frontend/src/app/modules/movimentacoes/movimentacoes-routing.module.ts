import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovimentacoesComponent } from './movimentacoes.component';


const routes: Routes = [
  { path: "", component: MovimentacoesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimentacoesRoutingModule { }
