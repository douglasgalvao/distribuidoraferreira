import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNovoClienteComponent } from './dialog-novo-cliente/dialog-novo-cliente.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class ClienteComponent implements OnInit {
  toolbarTitle: string = 'Contas Clientes';
  actions = [{
    icon: 'add',
    label: 'Ações',
    menu: 'Adicionar',
    menuItems: [
      {
        icon: 'person',
        label: 'Cadastrar Cliente',
        action: () => this.openDialogNovoCliente(),
      },
      // {
      //   icon: 'add_shopping_cart',
      //   label: 'Cadastrar Conta Cliente',
      //   action: () => this.openDialogNovaCompraCliente(),
      // },
    ],
  }];

  constructor(private dialog: MatDialog) { }

  ngOnInit() { }

  openDialogNovoCliente() {
    this.dialog.open(DialogNovoClienteComponent, {
      width: 'max-content',
      height: 'max-content',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    })
  }

  // openDialogNovaCompraCliente() {
  //   this.dialog.open(DialogNovaCompraClienteComponent, {
  //     width: 'max-content',
  //     height: 'max-content',
  //     enterAnimationDuration: '350ms',
  //     exitAnimationDuration: '350ms'
  //   })
  // }
}
