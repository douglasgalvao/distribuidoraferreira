import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-detalhes-venda',
  templateUrl: './dialog-detalhes-venda.component.html',
  styleUrls: ['./dialog-detalhes-venda.component.scss']
})
export class DialogDetalhesVendaComponent implements OnInit {

  vendaId: number = 0;
  detalhesDaVenda: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public venda: any) { }

  ngOnInit(): void {
    this.detalhesDaVenda = this.venda.movimentacoes_estoque;
    this.vendaId = this.venda.id;
  }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }


}
