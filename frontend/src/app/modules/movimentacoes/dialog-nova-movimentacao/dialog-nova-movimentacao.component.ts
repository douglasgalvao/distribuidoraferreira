import { NotificationService } from 'src/app/service/notifications/notifications.service';

// dialog-novo-produto.component.ts
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { MovimentacoesEstoque, ProdutoElement } from 'src/app/models/models';
import { ProdutoService } from 'src/app/service/produtos/produtos.service';

import { DialogNovoProdutoComponent } from '../../produtos/dialog-novo-produto/dialog-novo-produto.component';
import { MovimentacoesService } from 'src/app/service/movimentacoes/movimentacoes.service';
declare var page: any
@Component({
  selector: 'app-dialog-nova-movimentacao',
  templateUrl: './dialog-nova-movimentacao.component.html',
  styleUrls: ['./dialog-nova-movimentacao.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})

export class DialogNovaMovimentacaoComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  fBuilder: FormGroup;
  produtos: ProdutoElement[] = [];
  @ViewChild('codBarrasElement') codBarrasInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private fbuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogNovoProdutoComponent>,
    private produtoService: ProdutoService,
    private notificationService: NotificationService,
    private movimentacaoService: MovimentacoesService
  ) {
    this.form = this.fb.group({
      totalMovimentacao: ['', Validators.required],
      tipo: ['', Validators.required],
      observacao: ['', Validators.required],
      quantidade: ['', Validators.required],
      produto: ['', Validators.required],
    });

    this.fBuilder = this.fbuilder.group({
      totalMovimentacao: 0,
    });

  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.codBarrasInput?.nativeElement.focus();
    }, 0);
  }

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe((res) => {
      this.produtos = res.entity;
    });

    

  }

  salvarMovimentacao(form: MovimentacoesEstoque): void {
    form.valor = 0;
    this.movimentacaoService.postMovimentacao(form).subscribe((res) => {
      this.closeDialog();
      this.notificationService.notificarMovimentacaoCriada(form);
    });
  }



  closeDialog(): void {
    this.dialogRef.close();
  }
}

