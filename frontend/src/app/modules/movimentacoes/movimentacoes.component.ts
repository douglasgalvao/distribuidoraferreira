import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNovaMovimentacaoComponent } from './dialog-nova-movimentacao/dialog-nova-movimentacao.component';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovimentacoesService } from 'src/app/service/movimentacoes/movimentacoes.service';
import { MovimentacoesEstoque } from 'src/app/models/models';

@Component({
  selector: 'app-movimentacoes',
  templateUrl: './movimentacoes.component.html',
  styleUrls: ['./movimentacoes.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class MovimentacoesComponent implements OnInit {

  toolbarTitle: string = 'Movimentações de Estoque';
  movimentacoes: MovimentacoesEstoque[] = []
  actions = [{
    icon: 'add',
    label: 'Perda',
    menu: 'Adicionar',
    menuItems: [
      {
        icon: 'add', label: 'Adicionar Perda', action: () => this.dialog.open(DialogNovaMovimentacaoComponent,
          {
            width: 'max-content',
            height: 'max-content',
            panelClass: '',
            enterAnimationDuration: '350ms',
            exitAnimationDuration: '350ms'
          }
        )
      }
    ]
  }]

  constructor(private dialog: MatDialog, private notificationService: NotificationService, private _snackBar: MatSnackBar, private movimentacaoService: MovimentacoesService) { }

  ngOnInit(): void {



    this.notificationService.movimentacaoCriada$.subscribe(() => {

      this.movimentacaoService.getMovimentacoes().subscribe((movimentacoes) => {
        this.movimentacoes = movimentacoes.entity;
        this._snackBar.open('Movimentação realizada com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });

    });
  }
}
