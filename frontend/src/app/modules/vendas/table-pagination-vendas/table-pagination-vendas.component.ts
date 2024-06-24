import { Component, HostListener, Input, ViewChild } from '@angular/core';
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
export class TablePaginationVendasComponent {
  displayedColumns: string[] = ['id', 'dataEHora', 'totalVenda', 'metodoPagamento', 'status', 'detalhes'];
  columAction: string = 'Actions';
  vendasData!: Vendas[];
  dataSource!: MatTableDataSource<Vendas>;
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

  ngOnInit(): void {
    this.obterVendas();

    if (this.isCaixa) {
      this.vendasService.obterVendasOrderByDataHora().subscribe(e => {
        this.vendasData = e.entity;
        this.vendasData.forEach((venda) => {
          venda.data_hora = new Date(venda.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(venda.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        })
        this.dataSource = new MatTableDataSource(this.vendasData);
      });
    } else {
      this.vendasService.obterVendas().subscribe(e => {
        this.vendasData = e.entity;
        this.vendasData.forEach((venda) => {
          venda.data_hora = new Date(venda.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(venda.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        })
        this.dataSource = new MatTableDataSource(this.vendasData);
      });
    }


    this.notificationService.vendaCriada$.subscribe(venda => {
      if (venda) {
        this._snackBar.open('Venda cadastrada com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.obterVendas();
        this.dataSource.paginator = this.paginator;
      } else {
        this._snackBar.open('Venda não cadastrada!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });
    this.renderAccordingScreen();

  }

  private obterVendas() {
    this.vendasService.obterVendas().subscribe(e => {
      
      this.vendasData = e.entity;
      this.vendasData.forEach((venda) => {
        venda.data_hora = new Date(venda.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(venda.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      })
      this.dataSource = new MatTableDataSource(this.vendasData);

      this.dataSource.paginator = this.paginator;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }

  private renderAccordingScreen() {
    let screenSize = window.innerWidth;
    if (screenSize < 500) {
      this.displayedColumns = ['id', 'totalVenda', 'status'];
    } else if (screenSize >= 500 && screenSize < 800) {
      this.displayedColumns = ['id', 'totalVenda', 'metodoPagamento', 'status'];
    } else if (screenSize >= 800) {
      this.displayedColumns = ['id', 'dataEHora', 'totalVenda', 'metodoPagamento', 'status', 'detalhes'];
    }
  }
}
