import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ComandaRequestAddItens, ComandasItens } from 'src/app/models/models';
import { DialogNovaVendaComponent } from '../../vendas/dialog-nova-venda/dialog-nova-venda.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProdutoService } from 'src/app/service/produtos/produtos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendasService } from 'src/app/service/vendas/vendas.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { debounceTime } from 'rxjs';
import { ComandasService } from 'src/app/service/comandas/comandas.service';
import { CaixaService } from 'src/app/service/caixa/caixa.service';

@Component({
  selector: 'app-dialog-add-item-comanda',
  templateUrl: './dialog-add-item-comanda.component.html',
  styleUrls: ['./dialog-add-item-comanda.component.scss']
})
export class DialogAddItemComandaComponent implements OnInit {
  form!: FormGroup;
  produtosDaComanda!: ComandasItens[];
  produtosDaComandaStatic!: ComandasItens[];
  produtosDaComandaSelected: ComandasItens[] = [];
  dataSource!: MatTableDataSource<ComandasItens>;
  displayedColumns: string[] = ['img', 'produto', 'quantidade', 'actions'];
  tiposDePagamento: any[] = [
    { value: 'DEBITO', viewValue: 'Débito' },
    { value: 'CREDITO', viewValue: 'Crédito' },
    { value: 'PIX', viewValue: 'PIX' },
    { value: 'DINHEIRO', viewValue: 'Dinheiro' },
    { value: 'CONTACLIENTE', viewValue: 'Conta Cliente' }
  ];
  tiposDeStatus: any[] = [
    { value: 'CONCLUIDA', viewValue: 'Concluída' },
    { value: 'PENDENTE', viewValue: 'Pendente' }
  ]

  constructor(
    public dialogRef: MatDialogRef<DialogNovaVendaComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public comanda: any,
    private produtoService: ProdutoService,
    private matSnack: MatSnackBar,
    private comandaService: ComandasService,
    private caixaService: CaixaService,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      codBarras: ['', [Validators.minLength(8), Validators.maxLength(13)]],
      metodoPagamento: ['', Validators.required],
      statusVenda: ['', [Validators.required,]]
    });
  }


  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(produto => {
      this.produtosDaComandaStatic = produto.entity.map(e => ({
        id: e.id, produto: e, quantidade: 0, tipo: this.form.controls['statusVenda'].value
      }) as ComandasItens).filter(e => e.produto.estoque > 0);
      this.produtosDaComanda = this.produtosDaComandaStatic.map(e => e);
    })


    this.form.controls['codBarras'].valueChanges.pipe(
      debounceTime(300)
    ).subscribe((e) => {
      if (e.length == 13) {
        this.produtoService.getProdutoByCodBarras(e).subscribe((produto) => {
          if (produto.status === 200) {
            let produtoSelecionado = this.produtosDaComanda.find(p => p.produto.id === produto.entity.id);
            if (produtoSelecionado) {
              this.selectItemComanda(produtoSelecionado)
            } else {
              this.abrirSnackBar('Produto já Selecionado', 'Fechar');
            }
            this.dataSource = new MatTableDataSource(this.produtosDaComandaSelected.map(e => e));
          } else if (produto.status === 404) {
            this.abrirSnackBar('Produto não Encontrado!', 'Fechar');
          }

          this.form.controls['codBarras'].reset("");
        });
      }
    });
  }


  abrirSnackBar(message: string, action: string) {
    this.matSnack.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }


  onInput(event: any) {
    event.target.value = event.target.value.replace(/[^\d]/g, '');
  }


  verificarProduto() {
    this.produtoService.getProdutoByNome(this.form.value.nome).subscribe(
      (res) => {
        if (res) {
          this.produtoService.getProdutoByCodBarras(this.form.value.codBarras).subscribe(res => res ? true : false);
        }
        return false;
      }
    );
  }

  removeItemComanda(e: ComandasItens): void {
    this.produtosDaComandaSelected.splice(this.produtosDaComandaSelected.indexOf(e), 1);
    this.produtosDaComanda.push(e);
    this.dataSource = new MatTableDataSource(this.produtosDaComandaSelected.map(e => e))
  }

  changeQuantidadeItens(e: any, idProdutoVenda: any): void {
    this.produtosDaComandaSelected.map((item) => {
      if (item.produto.id === idProdutoVenda) {
        if (item.produto.estoque < e.target.value) {
          this.abrirSnackBar(`Quantidade maior que o estoque, Estoque atual: ${item.produto.estoque}`, 'Fechar');
          e.target.value = '';
          return;
        }
        item.quantidade = e.target.value;
      }
    })
  }

  selectItemComanda(e: ComandasItens): void {
    this.produtosDaComandaSelected.push(e);
    this.produtosDaComanda.splice(this.produtosDaComanda.indexOf(e), 1);
    this.dataSource = new MatTableDataSource(this.produtosDaComandaSelected.map(e => e))
  }

  processRequestByCodBarras(e: any) {
  }

  cadastrarItemComanda(): void {

    if (this.produtosDaComandaSelected.length === 0) {
      this.abrirSnackBar('Selecione ao menos um item para adicionar a comanda', 'Fechar');
      return;
    }

    this.produtosDaComandaSelected.forEach(e => {

      if (e.quantidade === 0 || e.quantidade === null) {
        this.abrirSnackBar('Selecione uma quantidade para adicionar a comanda', 'Fechar');
        return;
      }

      if (e.produto.estoque < e.quantidade) {
        this.abrirSnackBar(`Quantidade do produto ${e.produto.nome} maior que o estoque, Estoque atual: ${e.produto.estoque}`, 'Fechar');
        return;
      }

    })

    let comandaItens: any[] = this.produtosDaComandaSelected.map(e => ({
      id_produto: e.produto.id,
      quantidade: e.quantidade
    }) as any);


    this.caixaService.getCaixa().subscribe((caixa) => {
      if (caixa.entity.status === 'FECHADO') {
        this.abrirSnackBar('Caixa Fechado, abra o caixa para adicionar itens a comanda', 'Fechar');
        return;
      }

      this.comandaService.adicionarItemComanda(this.comanda.id, comandaItens).subscribe((res) => {
        this.notificationService.notificarComandaAlterada();
        this.abrirSnackBar(res.entity, 'Fechar');

      });


    });


    this.closeDialog();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);
    this.produtosDaComanda = this.produtosDaComandaStatic.filter((item) => this.normalizeAccents(item.produto.nome).toLowerCase().includes(normalizedFilter))
    this.produtosDaComandaSelected.forEach(e => {
      if (this.produtosDaComanda.includes(e)) {
        this.produtosDaComanda.splice(this.produtosDaComanda.indexOf(e), 1)
      }
    })

  }

  normalizeAccents(input: string): string {
    const accentsMap: { [key: string]: string } = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
      'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
      'ã': 'a', 'õ': 'o',
      'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
      'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u'
    };

    return input.replace(/[áéíóúàèìòùãõâêîôûäëïöü]/g, match => accentsMap[match] || match);
  }




  closeDialog(): void {
    this.dialogRef.close();
  }
}
