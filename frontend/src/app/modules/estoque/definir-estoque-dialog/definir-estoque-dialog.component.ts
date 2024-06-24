import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../service/notifications/notifications.service';
import { ProdutoService } from '../../../service/produtos/produtos.service';
import { ProdutoElement } from '../../../models/models';

@Component({
  selector: 'app-definir-estoque-dialog',
  templateUrl: './definir-estoque-dialog.component.html',
  styleUrls: ['./definir-estoque-dialog.component.scss']
})
export class DefinirEstoqueDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: ProdutoElement,
    private fb: FormBuilder,
    private produtoService: ProdutoService,
  ) { }

  produto = this.data;
  form = this.fb.group({
    estoqueMinimo: [0, Validators.required],
  })

  definirBaixoEstoque(e: any) {
    this.produtoService.definirBaixoEstoque(this.produto.id, e.estoqueMinimo).subscribe(
      res => {
        this.notificationService.notificarBaixoEstoqueDefinido(this.produto);
      }
    );

    this.dialog.closeAll();
  }

  cancelar() {
    this.dialog.closeAll();
  }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }

  ngOnInit(): void {
  }
}
