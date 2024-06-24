import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProdutoElement } from '../../../models/models';
import { NotificationService } from '../../../service/notifications/notifications.service';
import { DefinirEstoqueDialogComponent } from '../definir-estoque-dialog/definir-estoque-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-produto-estoque',
  templateUrl: './produto-estoque.component.html',
  styleUrls: ['./produto-estoque.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class ProdutoEstoqueComponent implements OnInit {
  @Input() produto!: ProdutoElement;

  constructor(private dialog: MatDialog,
    private notificationService: NotificationService,
    private _snackBar: MatSnackBar) { }

  definirEstoqueMinimo(produto: ProdutoElement) {
    this.dialog.open(DefinirEstoqueDialogComponent, {
      data: produto,
      width: 'max-content',
      height: 'max-content',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    }
    );
  }

  ngOnInit(): void {
    this.notificationService.baixoEstoqueDefinido$.subscribe(e => {
      this._snackBar.open(`Baixo estoque definido do Produto: ${e.nome}!`, 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
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
