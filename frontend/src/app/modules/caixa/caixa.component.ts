import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vendas } from 'src/app/models/models';
import { CaixaService } from 'src/app/service/caixa/caixa.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { VendasService } from 'src/app/service/vendas/vendas.service';

@Component({
  selector: 'app-caixa',
  templateUrl: './caixa.component.html',
  styleUrls: ['./caixa.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class CaixaComponent implements OnInit {
  toolbarTitle: string = 'Caixa';
  vendas: Vendas[] = []
  actions = [{
    icon: 'add',
    label: 'Perda',
    menu: 'Adicionar',
  }];



  constructor(private dialog: MatDialog, private caixaService: CaixaService, private notificationService: NotificationService) { }


  ngOnInit(): void {
    
  }
}
