import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNovaVendaComponent } from './dialog-nova-venda/dialog-nova-venda.component';
import { VendasService } from 'src/app/service/vendas/vendas.service';
import { Vendas } from 'src/app/models/models';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class VendasComponent implements OnInit {
  toolbarTitle = 'Vendas';
  actions = [{
    icon: 'flip_to_front',
    label: 'Novo',
    menu: 'Adicionar Venda',
    menuItems: [
      {
        icon: 'add_shopping_cart',
        label: 'Nova Venda',
        action: () => this.openDialogNovaVenda(),
      },
    ],
  }];
  isCaixa!: boolean;
  vendasData!: Vendas[];
  dataSource!: MatTableDataSource<Vendas>;
  isLoaded!: boolean;
  isLoading!: boolean;

  constructor(private dialog: MatDialog, private vendasService: VendasService, private notificationService: NotificationService,
    private _snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {

    this.isLoaded = false;
    this.isLoading = !this.isLoaded;

    if (this.isCaixa) {
      this.vendasService.obterVendasOrderByDataHora().subscribe(e => {
        this.vendasData = e.entity;
        this.vendasData.forEach((venda) => {
          venda.data_hora = new Date(venda.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(venda.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        })
        this.dataSource = new MatTableDataSource(this.vendasData);
        this.isLoaded = true;
        this.isLoading = !this.isLoaded;
      });
    } else {
      this.vendasService.obterVendas().subscribe(e => {
        this.vendasData = e.entity;
        this.vendasData.forEach((venda) => {
          venda.data_hora = new Date(venda.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(venda.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        })
        this.dataSource = new MatTableDataSource(this.vendasData);
        this.isLoaded = true;
        this.isLoading = !this.isLoaded;
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
      } else {
        this._snackBar.open('Venda não cadastrada!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });


  }

  private obterVendas() {
    this.isLoaded = false;
    this.isLoading = !this.isLoaded;
    this.vendasService.obterVendas().subscribe(e => {
      this.vendasData = e.entity;
      this.vendasData.forEach((venda) => {
        venda.data_hora = new Date(venda.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(venda.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      })
      this.dataSource = new MatTableDataSource(this.vendasData);
      this.isLoaded = true;
      this.isLoading = !this.isLoaded;
    });
  }


  openDialogNovaVenda(): void {
    this.dialog.open(DialogNovaVendaComponent,
      {
        width: 'max-content',
        height: 'max-content',
        enterAnimationDuration: '350ms',
        exitAnimationDuration: '350ms'
      }
    )
  }
}
