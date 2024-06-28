import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNovaCompraComponent } from './dialog-nova-compra/dialog-nova-compra.component';
import { ComprasService } from 'src/app/service/compras/compras.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { Compras } from 'src/app/models/models';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class ComprasComponent implements OnInit {
  toolbarTitle = 'Compras';
  actions = [
    {
      icon: 'flip_to_front',
      label: 'Novo',
      menu: 'Adicionar Compra',
      menuItems: [
        {
          icon: 'add_shopping_cart',
          label: 'Nova Compra',
          action: () => this.openDialogNovaCompra(),
        },
      ],
    }
  ];
  comprasData!: Compras[];
  dataSource!: MatTableDataSource<Compras>;
  isLoading!: boolean;
  isLoaded!: boolean;

  constructor(private comprasService: ComprasService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.isLoaded = false;
    this.isLoading = !this.isLoaded;
    forkJoin({
      obterCompras: this.comprasService.obterCompras()
    }).subscribe(({ obterCompras }) => {
      this.obterCompras(obterCompras);
      this.isLoaded = true;
      this.isLoading = !this.isLoaded;
    })

    this.notificationService.compraCriada$.subscribe(() => {
      this.isLoaded = false;
      this.isLoading = !this.isLoaded;
      forkJoin({
        obterCompras: this.comprasService.obterCompras()
      }).subscribe(({ obterCompras }) => {
        this.obterCompras(obterCompras);
        this.isLoaded = true;
        this.isLoading = !this.isLoaded;
      })
    })
  }

  obterCompras(obterCompras: any) {
    this.comprasData = obterCompras.entity;
    this.comprasData.forEach((compra) => {
      compra.data_hora = new Date(compra.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(compra.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    })
    this.dataSource = new MatTableDataSource(this.comprasData);
  }

  openDialogNovaCompra(): void {
    this.dialog.open(DialogNovaCompraComponent,
      {
        width: 'max-content',
        height: 'max-content',
        enterAnimationDuration: '350ms',
        exitAnimationDuration: '350ms'
      }
    )
  }
}
