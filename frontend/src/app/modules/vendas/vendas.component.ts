import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNovaVendaComponent } from './dialog-nova-venda/dialog-nova-venda.component';

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

  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
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
