import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MovimentacoesEstoque } from 'src/app/models/models';
import { MovimentacoesService } from 'src/app/service/movimentacoes/movimentacoes.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DrawerService } from 'src/app/service/drawer/drawer.service';

@Component({
  selector: 'app-movimentacoes-lista',
  templateUrl: './movimentacoes-lista.component.html',
  styleUrls: ['./movimentacoes-lista.component.scss']
})
export class MovimentacoesListaComponent implements OnInit {

  @Input() movimentacoes: MovimentacoesEstoque[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<MovimentacoesEstoque>();
  displayedColumns: string[] = ['id', 'horarioRegistro', 'tipo', 'quantidade', 'totalMovimentacao', 'produto', 'observacao'];

  constructor(private movimentacaoService: MovimentacoesService, private notificationService: NotificationService, private drawerService: DrawerService) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);

    this.dataSource.filter = normalizedFilter;

    this.dataSource.filterPredicate = (data: MovimentacoesEstoque, filter: string) => {
      const dataStr = this.normalizeAccents(Object.values(data).join(' ').toLowerCase());
      return dataStr.includes(filter);
    };
  }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
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


  updateTable() {
    this.movimentacaoService.getMovimentacoes().subscribe(
      movimentacoes => {
        movimentacoes.entity.forEach(e => e.horario_registro = new Date(e.horario_registro).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(e.horario_registro).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        this.movimentacoes = movimentacoes.entity
        this.dataSource = new MatTableDataSource(this.movimentacoes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  ngOnInit(): void {

    this.notificationService.movimentacaoCriada$.subscribe(() => {
      this.updateTable();
    });


    this.updateTable();
    this.renderAccordingScreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }

  renderAccordingScreen() {
    let screenSize = window.innerWidth;
    this.drawerService.toggleDrawerBool(false);
    if (screenSize < 500) {
      this.displayedColumns = ['tipo', 'totalMovimentacao', 'produto'];
    } else if (screenSize >= 500 && screenSize < 800) {
      this.displayedColumns = ['tipo', 'quantidade', 'totalMovimentacao', 'produto'];
    } else if (screenSize >= 800 && screenSize < 1200) {
      this.displayedColumns = ['id', 'horarioRegistro', 'tipo', 'quantidade', 'totalMovimentacao', 'produto', 'observacao'];
    } else if (screenSize >= 1200) {
      this.displayedColumns = ['id', 'horarioRegistro', 'tipo', 'quantidade', 'totalMovimentacao', 'produto', 'observacao'];
      this.drawerService.toggleDrawerBool(true);

    }
  }

}
