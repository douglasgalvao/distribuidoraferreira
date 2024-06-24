import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { ComprasItens, ComprasItensRequest, ProdutoElement } from 'src/app/models/models';
import { ComprasService } from 'src/app/service/compras/compras.service';
import { ProdutoService } from 'src/app/service/produtos/produtos.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dialog-nova-compra',
  templateUrl: './dialog-nova-compra.component.html',
  styleUrls: ['./dialog-nova-compra.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class DialogNovaCompraComponent implements OnInit {
  form!: FormGroup;
  itens!: ProdutoElement[];
  filteredItemsStatic: ComprasItens[] = [];
  filteredItems: ComprasItens[] = [];
  produtos: ProdutoElement[] = [];
  searchText!: FormControl;
  displayedColumns: string[] = ['nome', 'img', 'quantidade', 'preco', 'actions'];
  selectedItem: ComprasItens[] = [];
  dataSource!: MatTableDataSource<ComprasItens>;
  valorTotal!: number;
  ItensTotal!: number;
  tiposDePagamento: any[] = [
    { value: 'DEBITO', viewValue: 'Débito' },
    { value: 'CREDITO', viewValue: 'Crédito' },
    { value: 'PIX', viewValue: 'PIX' },
    { value: 'DINHEIRO', viewValue: 'Dinheiro' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogNovaCompraComponent>,
    private notificationService: NotificationService,
    private compraService: ComprasService,
    private produtoService: ProdutoService
  ) {
    this.form = this.fb.group({
      metodoPagamento: ['', Validators.required],
      observacao: ['']
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe((produtos) => {
      this.produtos = produtos.entity;
      this.filteredItemsStatic = this.produtos.map(e => {
        return {
          id: e.id,
          produto: e,
          quantidade: 0,
          precoUnitario: '',
          subTotal: 0,
          observacao: '',
          tipo: 'entrada',
          valor: 0
        }
      });
      this.filteredItems = this.filteredItemsStatic.map(e => e);
    });
    this.renderAccordingScreen();
  }

  changeQuantidadeItens(e: any, idItemCompra: any): void {
    this.selectedItem.map((item) => {
      if (item.id === idItemCompra) {
        item.quantidade = e.target.value;
      }
    });
  }

  changePrecoItens(e: any, idItemCompra: any): void {
    this.selectedItem.map((item) => {
      if (item.id === idItemCompra) {
        item.precoUnitario = e.target.value;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);
    this.filteredItems = this.filteredItemsStatic.filter((item) =>
      this.normalizeAccents(item.produto.nome).toLowerCase().includes(normalizedFilter)
    );
    this.selectedItem.forEach(e => {
      if (this.filteredItems.includes(e)) {
        this.filteredItems.splice(this.filteredItems.indexOf(e), 1);
      }
    });
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

  onInput(event: any) {
    event.target.value = event.target.value.replace(/[^\d]/g, '');
  }

  selectItemCompra(e: ComprasItens): void {
    this.selectedItem.push(e);
    this.dataSource = new MatTableDataSource(this.selectedItem.map(e => e));
    this.filteredItems.splice(this.filteredItems.indexOf(e), 1);
  }

  removeItemCompra(e: ComprasItens): void {
    this.selectedItem.splice(this.selectedItem.indexOf(e), 1);
    this.dataSource = new MatTableDataSource(this.selectedItem.map(e => e));
    this.filteredItems.push(e);
  }

  cadastrarCompra(): void {
    let comprasItens: ComprasItensRequest[] = this.selectedItem.map((item) => {
      return {
        produto: item.produto.id,
        quantidade: item.quantidade,
        preco_unitario: this.getValorMonetario(item.precoUnitario),
        observacao: item.observacao
      };
    });

    let request = {
      metodo_pagamento: this.form.controls['metodoPagamento'].value,
      movimentacoes_estoque: comprasItens
    };

    this.compraService.cadastrarCompra(request).subscribe((res) => {
      this.notificationService.notificarCompraCriada();
    });

    this.closeDialog();
  }

  private renderAccordingScreen() {
    let screenSize = window.innerWidth;
    if (screenSize < 500) {
      this.displayedColumns = ['nome', 'quantidade', 'preco', 'actions'];
    } else if (screenSize >= 500 && screenSize < 800) {
      this.displayedColumns = ['nome', 'quantidade', 'preco', 'actions'];
    } else if (screenSize >= 800) {
      this.displayedColumns = ['nome', 'img', 'quantidade', 'preco', 'actions'];
    }
  }

  onInputPoint(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = this.formatCurrency(input.value);
  }

  formatCurrency(value: string): string {
    const num = this.getValorMonetario(value);

    if (isNaN(num)) {
      return '';
    }

    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getValorMonetario(value: string): number {
    value = value.replace(/[^\d]/g, '');

    while (value.length < 3) {
      value = '0' + value;
    }

    const integerPart = value.slice(0, -2);
    const fractionalPart = value.slice(-2);

    return parseFloat(integerPart + '.' + fractionalPart);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
