import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Caixa, Cliente, Compras } from 'src/app/models/models';
import { CaixaService } from 'src/app/service/caixa/caixa.service';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { DetailsCaixaComponent } from './details-caixa/details-caixa.component';

@Component({
  selector: 'app-table-pagination-caixa',
  templateUrl: './table-pagination-caixa.component.html',
  styleUrls: ['./table-pagination-caixa.component.scss']
})

export class TablePaginationCaixaComponent implements OnInit {
  displayedColumns: string[] = ['id', 'data_hora', 'status', 'valor_inicial', 'faturamento_dia', 'valor_total', 'detalhes'];
  columAction: string = 'Actions';
  caixasData!: Caixa[];
  dataSource!: MatTableDataSource<Caixa>;
  isMobile = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private caixaService: CaixaService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);

    this.dataSource.filter = normalizedFilter;

    this.dataSource.filterPredicate = (data: Caixa, filter: string) => {
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

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }


  openDialogDetalhesCaixa(e: Caixa) {
    this.dialog.open(DetailsCaixaComponent,
      {
        data: e,
        width: 'max-content',
        height: 'max-content',
        enterAnimationDuration: '350ms',
        exitAnimationDuration: '350ms'
      }
    )
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }

  getCaixas() {
    this.caixaService.getCaixas().subscribe((caixas) => {
      this.caixasData = caixas.entity;
      this.dataSource = new MatTableDataSource(this.caixasData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  ngOnInit(): void {
    this.getCaixas();

    this.notificationService.caixaAlterado$.subscribe(() => this.getCaixas())

    this.renderAccordingScreen();

  }

  private renderAccordingScreen() {
    let screenSize = window.innerWidth;
    if (screenSize < 500) {
      this.displayedColumns = ['status', 'faturamento_dia', 'detalhes'];
    } else if (screenSize >= 500 && screenSize < 800) {
      this.displayedColumns = ['data_hora', 'status', 'faturamento_dia', 'detalhes'];
    } else if (screenSize >= 800) {
      this.displayedColumns = ['id', 'data_hora', 'status', 'valor_inicial', 'faturamento_dia', 'valor_total', 'detalhes'];
    }

  }
}
