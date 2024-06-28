import { Component, Input, OnInit } from '@angular/core';
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

  @Input() balance!: Balance[];

  constructor() { }


  ngOnInit(): void { }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }
}


