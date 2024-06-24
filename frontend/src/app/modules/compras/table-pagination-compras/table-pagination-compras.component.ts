import { ComprasService } from './../../../service/compras/compras.service';
import { Compra, Compras } from './../../../models/models';
import { Component, ViewChild, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../../service/notifications/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetalhesCompraComponent } from '../dialog-detalhes-compra/dialog-detalhes-compra.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-pagination-compras',
  templateUrl: './table-pagination-compras.component.html',
  styleUrls: ['./table-pagination-compras.component.scss']
})
export class TableComprasComponent implements OnInit {
  displayedColumns: string[] = ['id', 'dataEHora', 'totalCompra', 'metodoPagamento', 'detalhes'];
  columAction: string = 'Actions';
  comprasData!: Compras[];
  dataSource!: MatTableDataSource<Compras>;
  isMobile = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private comprasService: ComprasService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);

    this.dataSource.filter = normalizedFilter;

    this.dataSource.filterPredicate = (data: Compras, filter: string) => {
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

  openDialogDetalhesProduto(e: Compra) {
    this.dialog.open(DialogDetalhesCompraComponent,
      {
        data: { compra: e },
        width: 'max-content',
        height: 'max-content',
        enterAnimationDuration: '350ms',
        exitAnimationDuration: '350ms'
      }
    )
  }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }

  ngOnInit(): void {
    this.obterCompras();

    this.notificationService.compraCriada$.subscribe(
      compra => {
        if(compra){
          this._snackBar.open('Compra cadastrada com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.obterCompras();
          this.dataSource.paginator = this.paginator;
        }else {
          this._snackBar.open('Compra não cadastrada!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      }
    );

    this.renderAccordingScreen();

  }

  private obterCompras(){
    this.comprasService.obterCompras().subscribe(e => {
      this.comprasData = e.entity;
      this.comprasData.forEach((compra) => {
        compra.data_hora = new Date(compra.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(compra.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      })
      this.dataSource = new MatTableDataSource(this.comprasData);

      this.dataSource.paginator = this.paginator;
    });
  }


  private renderAccordingScreen() {
    let screenSize = window.innerWidth;
    if (screenSize < 500) {
      this.displayedColumns = ['dataEHora', 'totalCompra', 'detalhes'];
    } else if (screenSize >= 500 && screenSize < 800) {
      this.displayedColumns = ['dataEHora', 'totalCompra', 'metodoPagamento', 'detalhes'];
    } else if (screenSize >= 800) {
      this.displayedColumns = ['id', 'dataEHora', 'totalCompra', 'metodoPagamento', 'detalhes'];
    }

  }



}
