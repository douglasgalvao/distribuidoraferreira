import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VendaElement, Vendas } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-vendas-pendentes',
  templateUrl: './dialog-vendas-pendentes.component.html',
  styleUrls: ['./dialog-vendas-pendentes.component.scss']
})
export class DialogVendasPendentesComponent implements OnInit {

  vendasPendentes!: any[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any[]) { }

  ngOnInit(): void {
    this.vendasPendentes = this.data.map(venda => {
      return {
        id: venda.id,
        metodo_pagamento: venda.metodo_pagamento,
        movimentacoes_estoque: venda.movimentacoes_estoque,
        status: venda.status,
        total_venda: venda.total_venda,
        data_hora: new Date(venda.data_hora).toLocaleString()
      }
    });


  }
}
