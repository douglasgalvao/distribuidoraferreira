import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNovoClienteComponent } from './dialog-novo-cliente/dialog-novo-cliente.component';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { Balance, ClienteResponse } from 'src/app/models/models';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { MatTableDataSource } from '@angular/material/table';

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
    ],
  }];

  balance: Balance[] = [
    {
      toolbarTitle: 'Inadimplência Total',
      toolbarIcon: 'wallet',
      value: 0.00,
      currency: 'BRL',
      arrowType: 'none',
      isCurrency: true
    },
    {
      toolbarTitle: 'Clientes Inadimplentes',
      toolbarIcon: 'wallet',
      value: 0,
      currency: 'none',
      arrowType: 'none',
      isCurrency: false
    }
  ];

  data!: ClienteResponse[];
  dataSource!: MatTableDataSource<ClienteResponse>;
  isLoaded!: boolean;
  isLoading!: boolean;

  constructor(private dialog: MatDialog, private clienteService: ClienteService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.isLoaded = false;
    this.isLoading = !this.isLoaded;

    forkJoin({
      getClientesInadimplementes: this.clienteService.obterClientesInadimplentes(),
      getClientes: this.clienteService.obterClientes()
    }).subscribe(({ getClientesInadimplementes, getClientes }) => {
      if (!getClientesInadimplementes.entity) {
        this.balance[0].value = 0.0;
        this.balance[0].arrowType = 'none';
      } else {
        this.balance[0].value = getClientesInadimplementes.entity.reduce((acc, curr) => acc + curr.saldo_devedor, 0.0);
        this.balance[0].arrowType = 'none';
      }

      if (!getClientesInadimplementes.entity) {
        this.balance[1].value = 0;
        this.balance[1].arrowType = 'none';
      } else {
        this.balance[1].value = getClientesInadimplementes.entity.length;
        this.balance[1].arrowType = 'none';
      }

      if (!getClientes.entity) {
        this.data = [];
      } else {
        this.data = getClientes.entity;
        this.dataSource = new MatTableDataSource(this.data);
      }

      this.isLoaded = true;
      this.isLoading = !this.isLoaded;

    })

    this.notificationService.contaPaga$.subscribe(e => {
      this.isLoaded = false;
      this.isLoading = !this.isLoaded;

      this.clienteService.obterClientesInadimplentes().subscribe(res => {
        if (!res.entity) {
          this.balance[0].value = 0.0;
          this.balance[0].arrowType = 'none';
        } else {
          this.balance[0].value = res.entity.reduce((acc, curr) => acc + curr.saldo_devedor, 0.0);
          this.balance[0].arrowType = 'none';
        }

        if (!res.entity) {
          this.balance[1].value = 0;
          this.balance[1].arrowType = 'none';
        } else {
          this.balance[1].value = res.entity.length;
          this.balance[1].arrowType = 'none';
        }

        this.isLoaded = true;
        this.isLoading = !this.isLoaded;
      });

      this.clienteService.obterClientes().subscribe(res => {
        if (!res.entity) {
          this.data = [];
        } else {
          this.data = res.entity;
          this.dataSource = new MatTableDataSource(this.data);
        }

      })

    });

    this.notificationService.clienteCriado$.subscribe(e => {
      this.isLoaded = false;
      this.isLoading = !this.isLoaded;
      this.clienteService.obterClientes().subscribe(res => {
        if (!res.entity) {
          this.data = [];
        } else {
          this.data = res.entity;
          this.dataSource = new MatTableDataSource(this.data);
        }

        this.isLoaded = true;
        this.isLoading = !this.isLoaded;
      });
    });



  }

  openDialogNovoCliente() {
    this.dialog.open(DialogNovoClienteComponent, {
      width: 'max-content',
      height: 'max-content',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    })
  }

}
