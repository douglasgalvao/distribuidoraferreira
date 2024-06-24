import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaComponent } from './comanda.component';
import { MaterialModule } from '../../material-module';
import { ComandaRoutingModule } from './comanda-routing.module';
import { CardComandaComponent } from './card-comanda/card-comanda.component';
import { SharedModule } from '../shared/shared.module';
import { DialogActionComandaComponent } from './card-comanda/dialog-buttons/actions-buttons-comanda.component';
import { DialogCreateComandaComponent } from './dialog-create-comanda/dialog-create-comanda.component';
import { DialogAddItemComandaComponent } from './dialog-add-item-comanda/dialog-add-item-comanda.component';
import { DialogListEditComandaComponent } from './dialog-list-edit-comanda/dialog-list-edit-comanda.component';
import { DialogFinalizarComandaComponent } from './dialog-finalizar-comanda/dialog-finalizar-comanda.component';
import { DialogConfirmarPagamentoComandaComponent } from './dialog-confirmar-pagamento-comanda/dialog-confirmar-pagamento-comanda.component';



@NgModule({
  declarations: [
    ComandaComponent,
    CardComandaComponent,
    DialogActionComandaComponent,
    DialogCreateComandaComponent,
    DialogAddItemComandaComponent,
    DialogListEditComandaComponent,
    DialogFinalizarComandaComponent,
    DialogConfirmarPagamentoComandaComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ComandaRoutingModule,
    SharedModule
  ]
})
export class ComandaModule { }
