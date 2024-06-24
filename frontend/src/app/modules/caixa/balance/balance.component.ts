import { Component, OnInit } from '@angular/core';
import { Balance, caixaRequest, caixaResponse } from 'src/app/models/models';
import { DialogSetValorInitCaixaComponent } from '../dialog-set-valor-init-caixa/dialog-set-valor-init-caixa.component';
import { Action } from 'rxjs/internal/scheduler/Action';
import { MatDialog } from '@angular/material/dialog';
import { CaixaService } from 'src/app/service/caixa/caixa.service';
import { DialogSetCloseCaixaComponent } from '../dialog-set-close-caixa/dialog-set-close-caixa.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/service/notifications/notifications.service';

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
      this.dialog.open(DialogSetValorInitCaixaComponent, {
        width: 'max-content',
        height: 'max-content',
        panelClass: '',
        enterAnimationDuration: '350ms',
        exitAnimationDuration: '350ms'
      });
    },
  },
  {
    action: () => {
      this.dialog.open(DialogSetCloseCaixaComponent, {
        data: this.caixaID,
        width: 'max-content',
        height: 'max-content',
        panelClass: '',
        enterAnimationDuration: '350ms',
        exitAnimationDuration: '350ms'
      });
    },
  }]

  balance: Balance = {
    toolbarTitle: 'Faturamento Diário',
    toolbarIcon: 'wallet',
    value: 0.0,
    currency: 'BRL',
    arrowType: 'none',
    isCurrency: false
  }


  caixaAberto!: boolean;
  caixaID!: number;

  constructor(
    private dialog: MatDialog,
    private caixaService: CaixaService,
    private notification: NotificationService
  ) { }


  ngOnInit(): void {

    this.caixaService.verificarCaixa().subscribe(res => {
      this.caixaAberto = res.entity
    })

    this.caixaService.getCaixa().subscribe(res => {
      const entity = res.entity ?? {};
      const faturamentoDia = entity.faturamento_dia ?? 0.0;

      this.balance.value = faturamentoDia;
      if(this.balance.value == 0.0){
        this.balance.arrowType = 'none';
      }else{
        this.balance.arrowType = faturamentoDia > 0 ? 'up' : 'down';
      }
      
    });


    this.caixaService.getCaixaID().subscribe(res => {
      this.caixaID = res.entity;
    })

    this.notification.caixaAlterado$.subscribe(() => {

      this.caixaService.verificarCaixa().subscribe(res => {
        this.caixaAberto = res.entity
      })

      this.caixaService.getCaixaID().subscribe(res => {
        this.caixaID = res.entity;
      })

      this.caixaService.getCaixa().subscribe(res => {
        const entity = res.entity ?? {};
        const faturamentoDia = entity.faturamento_dia ?? 0.0;

        this.balance.value = faturamentoDia;
        this.balance.arrowType = faturamentoDia > 0 ? 'up' : 'down';
      });
    })

  }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }
  
}


