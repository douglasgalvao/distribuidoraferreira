import { Component, Input, OnInit } from '@angular/core';
import { Balance, caixaRequest, caixaResponse } from 'src/app/models/models';
import { DialogSetValorInitCaixaComponent } from '../dialog-set-valor-init-caixa/dialog-set-valor-init-caixa.component';
import { Action } from 'rxjs/internal/scheduler/Action';
import { MatDialog } from '@angular/material/dialog';
import { CaixaService } from 'src/app/service/caixa/caixa.service';
import { DialogSetCloseCaixaComponent } from '../dialog-set-close-caixa/dialog-set-close-caixa.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { forkJoin } from 'rxjs';

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

  @Input() balance: Balance = { toolbarTitle: 'Faturamento Diário', toolbarIcon: 'wallet', value: 0.0, currency: 'BRL', arrowType: 'none', isCurrency: false }
  @Input() caixaAberto!: boolean;
  @Input() caixaID!: number;

  constructor(
    private dialog: MatDialog
  ) { }


  ngOnInit(): void { }


  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }

}


