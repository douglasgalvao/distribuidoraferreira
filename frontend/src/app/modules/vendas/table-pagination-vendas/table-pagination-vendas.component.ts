import { Component, HostListener, Input, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Venda, Vendas } from 'src/app/models/models';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { VendasService } from 'src/app/service/vendas/vendas.service';
import { DialogDetalhesVendaComponent } from '../dialog-detalhes-venda/dialog-detalhes-venda.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-pagination-vendas',
  templateUrl: './table-pagination-vendas.component.html',
  styleUrls: ['./table-pagination-vendas.component.scss']
})
export class TablePaginationVendasComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'dataEHora', 'totalVenda', 'metodoPagamento','caixa', 'status', 'detalhes'];
  columAction: string = 'Actions';
  @Input() vendasData!: Vendas[];
  @Input() dataSource!: MatTableDataSource<Vendas>;
  @Input() isCaixa!: boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private vendasService: VendasService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {

  }


  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);

    this.dataSource.filter = normalizedFilter;

    this.dataSource.filterPredicate = (data: Vendas, filter: string) => {
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

  ngAfterViewInit(): void {
    this.obterVendas();
  }

  ngOnInit(): void {
    this.renderAccordingScreen();
    this.notificationService.vendaCriada$.subscribe(() => {
      this.obterVendas();
    })
  }

  private obterVendas() {
    this.dataSource.paginator = this.paginator;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }

  private renderAccordingScreen() {
    let screenSize = window.innerWidth;
    if (screenSize < 500) {
      this.displayedColumns = ['caixa', 'totalVenda', 'status'];
    } else if (screenSize >= 500 && screenSize < 800) {
      this.displayedColumns = ['caixa', 'totalVenda', 'metodoPagamento', 'status'];
    } else if (screenSize >= 800) {
      this.displayedColumns = ['caixa', 'dataEHora', 'totalVenda', 'metodoPagamento', 'status', 'detalhes'];
    }
  }
}
