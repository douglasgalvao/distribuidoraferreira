import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComprasItens, DetalhesCompra } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-detalhes-compra',
  templateUrl: './dialog-detalhes-compra.component.html',
  styleUrls: ['./dialog-detalhes-compra.component.scss']
})
export class DialogDetalhesCompraComponent implements OnInit {
  compraId!: number;
  detalhesDaCompra!: DetalhesCompra[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.compraId = this.data.compra.compra_id;
    this.detalhesDaCompra = this.data.compra.movimentacoes_estoque;
    this.detalhesDaCompra.map(e=>{ e.horario_registro = new Date(e.horario_registro).toLocaleString()})
  }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }
  
}
