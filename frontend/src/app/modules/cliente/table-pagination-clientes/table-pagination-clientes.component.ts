import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente, ClienteResponse, Compras } from 'src/app/models/models';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { DetalhesClienteComponent } from '../detalhes-cliente/detalhes-cliente.component';
import { AlterarInfosClienteComponent } from '../dialog-alterar-infos-cliente/dialog-alterar-infos-cliente.component';

@Component({
  selector: 'app-table-pagination-clientes',
  templateUrl: './table-pagination-clientes.component.html',
  styleUrls: ['./table-pagination-clientes.component.scss']
})

export class TablePaginationClientesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome_cliente', 'telefone', 'saldo_devedor', 'status', 'detalhes'];
  columAction: string = 'Actions';
  data!: ClienteResponse[];
  dataSource!: MatTableDataSource<ClienteResponse>;
  isMobile = false
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private clienteService: ClienteService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);

    this.dataSource.filter = normalizedFilter;

    this.dataSource.filterPredicate = (data: ClienteResponse, filter: string) => {
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

  openDialogDetalhesCliente(e: Cliente) {
    this.dialog.open(DetalhesClienteComponent, {
      data: { Cliente: e },
      width: 'max-content',
      height: 'max-content',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    }
    )
  }

  openDialogEditarCliente(e: Cliente) {
    this.dialog.open(AlterarInfosClienteComponent, {
      data: { Cliente: e },
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

  ngOnInit(): void {
    this.obterClientes();
    this.notificationService.clienteCriado$.subscribe(cliente => this.obterClientes());

    this.notificationService.contaPaga$.subscribe(e => this.obterClientes());


    this.renderAccordingScreen();

  }

  private obterClientes() {
    this.clienteService.obterClientes().subscribe(e => {
      this.data = e.entity;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  private renderAccordingScreen() {
    let screenSize = window.innerWidth;
    if (screenSize < 500) {
      this.displayedColumns = ['nome_cliente', 'saldo_devedor', 'detalhes'];
    } else if (screenSize >= 500 && screenSize < 800) {
      this.displayedColumns = ['nome_cliente', 'saldo_devedor', 'status', 'detalhes'];
    } else if (screenSize >= 800) {
      this.displayedColumns = ['id', 'nome_cliente', 'telefone', 'saldo_devedor', 'status', 'detalhes'];
    }
  }
}
