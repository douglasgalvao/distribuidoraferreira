import { Component, OnInit } from '@angular/core';
import { Balance } from 'src/app/models/models';
import { Action } from 'rxjs/internal/scheduler/Action';
import { MatDialog } from '@angular/material/dialog';
import { CaixaService } from 'src/app/service/caixa/caixa.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { ClienteService } from 'src/app/service/cliente/cliente.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]

})
export class BalanceComponent implements OnInit {
  actions = [{
    action: () => {
      // this.dialog.open(DialogSetCloseCaixaComponent, {
      //   data: this.caixaID,
      //   width: 'max-content',
      //   height: 'max-content',
      //   panelClass: '',
      //   enterAnimationDuration: '350ms',
      //   exitAnimationDuration: '350ms'
      // });
    },
  }]

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

  constructor(
    private dialog: MatDialog,
    private clienteService: ClienteService,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.clienteService.obterClientesInadimplentes().subscribe(res => {
      if(!res.entity){
        this.balance[0].value = 0.0;
        this.balance[0].arrowType = 'none';
      }else{
        this.balance[0].value = res.entity.reduce((acc, curr) => acc + curr.saldo_devedor, 0.0);
        this.balance[0].arrowType = 'none';
      }

      if(!res.entity) {
        this.balance[1].value = 0;
        this.balance[1].arrowType = 'none';
      }else{
        this.balance[1].value = res.entity.length;
        this.balance[1].arrowType = 'none';
      }
    });

    this.notificationService.contaPaga$.subscribe(e => {
      this.clienteService.obterClientesInadimplentes().subscribe(res => {
        if(!res.entity){
          this.balance[0].value = 0.0;
          this.balance[0].arrowType = 'none';
        }else{
          this.balance[0].value = res.entity.reduce((acc, curr) => acc + curr.saldo_devedor, 0.0);
          this.balance[0].arrowType = 'none';
        }
  
        if(!res.entity) {
          this.balance[1].value = 0;
          this.balance[1].arrowType = 'none';
        }else{
          this.balance[1].value = res.entity.length;
          this.balance[1].arrowType = 'none';
        }
      });
    });
  }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }
}


