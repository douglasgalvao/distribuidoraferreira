import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComandaElement, VendaComandaElement } from 'src/app/models/models';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { VendasService } from 'src/app/service/vendas/vendas.service';

@Component({
  selector: 'app-dialog-list-edit-comanda',
  templateUrl: './dialog-list-edit-comanda.component.html',
  styleUrls: ['./dialog-list-edit-comanda.component.scss']
})
export class DialogListEditComandaComponent implements OnInit {

  comandaDetails!: ComandaElement;


  constructor(
    @Inject(MAT_DIALOG_DATA) comanda: any,
    private vendaService: VendasService,
    private notificationService: NotificationService
  ) {
    this.comandaDetails = comanda;
  }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }

  getVendasByComanda(): any {
    this.vendaService.obterVendasByComanda(this.comandaDetails.id).subscribe((e) => {
      this.comandaDetails.venda = e.entity;
      console.log(this.comandaDetails.venda)
    })
  }

  ngOnInit(): void {
    this.getVendasByComanda();
    this.notificationService.comandaFinalizada$.subscribe((data) => {
      this.getVendasByComanda();
    });
  }



}
