import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNovaCompraComponent } from './dialog-nova-compra/dialog-nova-compra.component';
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

  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
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
