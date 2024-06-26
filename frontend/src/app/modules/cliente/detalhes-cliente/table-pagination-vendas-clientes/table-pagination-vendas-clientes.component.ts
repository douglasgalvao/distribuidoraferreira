import { AfterViewInit, Component, HostListener, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Venda, VendaResponse } from 'src/app/models/models';
import { DialogDetalhesVendaComponent } from 'src/app/modules/vendas/dialog-detalhes-venda/dialog-detalhes-venda.component';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { VendasService } from 'src/app/service/vendas/vendas.service';
import { DialogConfirmarPagamentoComponent } from './dialog-confirmar-pagamento/dialog-confirmar-pagamento.component';

@Component({
  selector: 'app-table-pagination-vendas-clientes',
  templateUrl: './table-pagination-vendas-clientes.component.html',
  styleUrls: ['./table-pagination-vendas-clientes.component.scss']
})
export class TablePaginationVendasClientesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'data_hora', 'total_venda', 'total_pago', 'status', 'detalhes'];
  columAction: string = 'Actions';
  @Input() vendasData!: VendaResponse[];
  @Input() dataSource!: MatTableDataSource<VendaResponse>;
  isMobile = false;
  idCliente!: Number;
  @Input() id_cliente!: number
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private clienteService: ClienteService,
    private notificationService: NotificationService,
    private vendaService: VendasService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) {

  }
  ngAfterViewInit(): void {
    this.obterClienteById();
  }

  ngOnInit(): void {

    this.idCliente = this.id_cliente;

    this.renderAccordingScreen();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);

    this.dataSource.filter = normalizedFilter;

    this.dataSource.filterPredicate = (data: VendaResponse, filter: string) => {
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


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }



  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }

  private obterClienteById() {
    this.dataSource.paginator = this.paginator;
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
}
