import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VendasService } from 'src/app/service/vendas/vendas.service';
import { DialogDetalhesVendaComponent } from '../../vendas/dialog-detalhes-venda/dialog-detalhes-venda.component';
import { DialogConfirmarPagamentoComponent } from '../../cliente/detalhes-cliente/table-pagination-vendas-clientes/dialog-confirmar-pagamento/dialog-confirmar-pagamento.component';
import { Venda } from 'src/app/models/models';
import { DialogConfirmarPagamentoComandaComponent } from '../dialog-confirmar-pagamento-comanda/dialog-confirmar-pagamento-comanda.component';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { ComandasService } from 'src/app/service/comandas/comandas.service';

@Component({
  selector: 'app-dialog-finalizar-comanda',
  templateUrl: './dialog-finalizar-comanda.component.html',
  styleUrls: ['./dialog-finalizar-comanda.component.scss']
})
export class DialogFinalizarComandaComponent implements OnInit {


  comanda: any;
  vendasDaComanda: any;
  dataSource: any;
  vendasConcluidas!: boolean;
  comandaJaFinalizada!: boolean;
  nomeCliente!: string;
  displayedColumns: string[] = ['id', 'data_hora', 'total_venda', 'total_pago', 'status', 'detalhes'];
  id_cliente!: number;

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
    private vendaService: VendasService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogFinalizarComandaComponent>,
    private comandaService: ComandasService,
    private notificationService: NotificationService) {
    this.comanda = data;
  }




  ngOnInit(): void {

    this.vendaService.obterVendasByComanda(this.comanda.id).subscribe((e) => {
      this.vendasDaComanda = e.entity;
      this.comanda.venda = this.vendasDaComanda;
      this.id_cliente = this.comanda.idCliente;
      this.nomeCliente = this.comanda.nomeCliente;
      this.dataSource = this.vendasDaComanda;
      this.comanda.status == 'FECHADA' ? this.comandaJaFinalizada = true : this.comandaJaFinalizada = false;
      this.vendasDaComanda.find((e: { status: string; }) => e.status == 'PENDENTE') ? this.vendasConcluidas = false : this.vendasConcluidas = true;
    })

    this.notificationService.contaPaga$.subscribe((data) => {
      this.vendaService.obterVendasByComanda(this.comanda.id).subscribe((e) => {
        this.vendasDaComanda = e.entity;
        this.comanda.venda = this.vendasDaComanda;
        this.id_cliente = this.comanda.id_cliente;
        this.nomeCliente = this.comanda.nomeCliente;
        this.dataSource = this.vendasDaComanda;
        this.comanda.status == 'FECHADA' ? this.comandaJaFinalizada = true : this.comandaJaFinalizada = false;
        this.vendasDaComanda.find((e: { status: string; }) => e.status == 'PENDENTE') ? this.vendasConcluidas = false : this.vendasConcluidas = true;
      })
    });

    this.notificationService.comandaFinalizada$.subscribe((data) => {
      this.vendaService.obterVendasByComanda(this.comanda.id).subscribe((e) => {
        this.vendasDaComanda = e.entity;
        this.comanda.venda = this.vendasDaComanda;
        this.id_cliente = this.comanda.id_cliente;
        this.nomeCliente = this.comanda.nomeCliente;
        this.dataSource = this.vendasDaComanda;
        this.comanda.status == 'FECHADA' ? this.comandaJaFinalizada = true : this.comandaJaFinalizada = false;
        this.vendasDaComanda.find((e: { status: string; }) => e.status == 'PENDENTE') ? this.vendasConcluidas = false : this.vendasConcluidas = true;
      })
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }

  private renderAccordingScreen() {
    let screenSize = window.innerWidth;
    if (screenSize < 500) {
      this.displayedColumns = ['total_venda', 'total_pago', 'status', 'detalhes'];
    } else if (screenSize >= 500 && screenSize < 800) {
      this.displayedColumns = ['data_hora', 'total_venda', 'total_pago', 'status', 'detalhes'];
    } else if (screenSize >= 800) {
      this.displayedColumns = ['id', 'data_hora', 'total_venda', 'total_pago', 'status', 'detalhes'];
    }
  }


  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }

  openDialogConfirmarPagamentoComanda() {
    this.dialog.open(DialogConfirmarPagamentoComandaComponent,
      {
        data: this.comanda,
        width: 'max-content',
        height: 'max-content',
        enterAnimationDuration: '350ms',
        exitAnimationDuration: '350ms'
      })
  }

  openDialogDetalhesVenda(e: Venda) {
    this.dialog.open(DialogDetalhesVendaComponent,
      {
        data: e,
        width: 'max-content',
        height: 'max-content',
        enterAnimationDuration: '350ms',
        exitAnimationDuration: '350ms'
      }
    )
  }

  openDialogConfirmarPagamento(valor: number, id_cliente: Number) {
    this.dialog.open(DialogConfirmarPagamentoComponent,
      {
        data: [valor, id_cliente],
        width: 'max-content',
        height: 'max-content',
        enterAnimationDuration: '350ms',
        exitAnimationDuration: '350ms'
      }
    )
  }


  finalizarComanda() {
    this.comandaService.finalizarComanda(this.comanda.id).subscribe((e) => {
      this.notificationService.notificarComandaFinalizada();
      this.closeDialog();
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);

    this.dataSource.filter = normalizedFilter;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = this.normalizeAccents(Object.values(data).join(' ').toLowerCase());
      return dataStr.includes(filter);
    };
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
