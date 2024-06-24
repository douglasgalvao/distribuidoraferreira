import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProdutoService } from 'src/app/service/produtos/produtos.service';
import { ClienteResponse, ProdutoElement, VendasItens, VendasItensRequest } from 'src/app/models/models';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendasService } from 'src/app/service/vendas/vendas.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { ClienteService } from 'src/app/service/cliente/cliente.service';

@Component({
  selector: 'app-dialog-nova-venda',
  templateUrl: './dialog-nova-venda.component.html',
  styleUrls: ['./dialog-nova-venda.component.scss']
})
export class DialogNovaVendaComponent implements OnInit {
  form!: FormGroup;
  produtosDaVenda!: VendasItens[];
  produtosDaVendaStatic!: VendasItens[];
  produtosDaVendaSelected: VendasItens[] = [];
  dataSource!: MatTableDataSource<VendasItens>;
  clientes!: ClienteResponse[];
  isContaCliente = false;
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
    private produtoService: ProdutoService,
    private matSnack: MatSnackBar,
    private vendaService: VendasService,
    private notificationService: NotificationService,
    private clienteService: ClienteService
  ) {
    this.form = this.fb.group({
      codBarras: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(13)]],
      metodoPagamento: ['', Validators.required],
      observacao: [''],
      contaCliente: [''],
    });
  }


  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(produto => {

      this.produtosDaVendaStatic = produto.entity.map(e => ({
        id: e.id, produto: e, quantidade: 0,
        observacao: this.form.controls['observacao'].value
      }) as any).filter(e => e.produto.estoque > 0);

      this.produtosDaVenda = this.produtosDaVendaStatic.map(e => e);
    })

    this.clienteService.obterClientes().subscribe(cliente => {
      this.clientes = cliente.entity
    })

    this.form.controls['codBarras'].valueChanges.pipe(
      debounceTime(500)
    ).subscribe((codBarras) => {
      if (codBarras.length == 13) {
        this.produtoService.getProdutoByCodBarras(codBarras).subscribe((produto) => {
          if (produto.status === 200) {
            let produtoSelecionado = this.produtosDaVenda.find(p => p.produto.id === produto.entity.id);
            if (produtoSelecionado) {
              this.selectItemVenda(produtoSelecionado)
            } else {
              this.abrirSnackBar('Produto já Selecionado', 'Fechar');
            }
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

  removeItenVenda(e: VendasItens): void {
    this.produtosDaVendaSelected.splice(this.produtosDaVendaSelected.indexOf(e), 1);
    this.produtosDaVenda.push(e);
    this.dataSource = new MatTableDataSource(this.produtosDaVendaSelected.map(e => e))
    if (this.produtosDaVendaSelected.length === 0) {
      this.form.controls['codBarras'].setValidators(Validators.required);
    }
  }

  changeQuantidadeItens(e: any, idProdutoVenda: any): void {
    this.produtosDaVendaSelected.map((item) => {
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



  selectItemVenda(e: any): void {
    this.produtosDaVendaSelected.push(e);
    this.produtosDaVenda.splice(this.produtosDaVenda.indexOf(e), 1);
    this.dataSource = new MatTableDataSource(this.produtosDaVendaSelected)
  }

  cadastrarVenda(): void {
    let VendasItens: any = this.produtosDaVendaSelected.map((item) => {
      return {
        produto: item.produto.id,
        quantidade: item.quantidade,
        tipo: "SAIDA",
        preco_unitario: item.produto.preco,
        observacao: this.form.controls['observacao'].value
      }
    })




    let request = {
      metodo_pagamento: this.form.controls['metodoPagamento'].value,
      movimentacoes_estoque: VendasItens,
      conta_cliente: this.form.controls['contaCliente'].value ? this.form.controls['contaCliente'].value : null
    }



    this.vendaService.cadastrarVenda(request).subscribe((res) => {

      if (res.status === 400) {
        this.abrirSnackBar('Erro ao cadastrar venda, Caixa não foi aberto', 'Fechar');
        return;
      }
      this.notificationService.notificarVendaCriada();
    })

    this.closeDialog();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);
    this.produtosDaVenda = this.produtosDaVendaStatic.filter((item) => this.normalizeAccents(item.produto.nome).toLowerCase().includes(normalizedFilter))
    this.produtosDaVendaSelected.forEach(e => {
      if (this.produtosDaVenda.includes(e)) {
        this.produtosDaVenda.splice(this.produtosDaVenda.indexOf(e), 1)
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
