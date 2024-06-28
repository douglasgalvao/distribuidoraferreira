import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogNovaMovimentacaoComponent } from './dialog-nova-movimentacao/dialog-nova-movimentacao.component';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovimentacoesService } from 'src/app/service/movimentacoes/movimentacoes.service';
import { MovimentacoesEstoque } from 'src/app/models/models';
import { MatTableDataSource } from '@angular/material/table';

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
  dataSource!: MatTableDataSource<MovimentacoesEstoque>;
  isLoading!: boolean;
  isLoaded!: boolean;

  constructor(private dialog: MatDialog, private notificationService: NotificationService, private _snackBar: MatSnackBar, private movimentacaoService: MovimentacoesService) { }

  ngOnInit(): void {
    this.updateTable();

    this.notificationService.movimentacaoCriada$.subscribe(() => {
      this.isLoaded = false;
      this.isLoading = !this.isLoaded;

      this.movimentacaoService.getMovimentacoes().subscribe((movimentacoes) => {
        this.movimentacoes = movimentacoes.entity;
        this.dataSource = new MatTableDataSource(this.movimentacoes);
        this._snackBar.open('Movimentação realizada com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        this.isLoaded = true;
        this.isLoading = !this.isLoaded;
      });

    });
  }


  updateTable() {
    this.isLoaded = false;
    this.isLoading = !this.isLoaded;
    this.movimentacaoService.getMovimentacoes().subscribe(
      movimentacoes => {
        movimentacoes.entity.forEach(e => e.horario_registro = new Date(e.horario_registro).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(e.horario_registro).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        this.movimentacoes = movimentacoes.entity
        this.dataSource = new MatTableDataSource(this.movimentacoes);
        this.isLoaded = true;
        this.isLoading = !this.isLoaded;
      }
    );
  }

}
