import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CaixaService } from 'src/app/service/caixa/caixa.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';

@Component({
  selector: 'app-dialog-set-close-caixa',
  templateUrl: './dialog-set-close-caixa.component.html',
  styleUrls: ['./dialog-set-close-caixa.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class DialogSetCloseCaixaComponent implements OnInit {
  caixaID!: number;

  constructor(private caixaService: CaixaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationService,
    private _snackBar: MatSnackBar
  ) { }

  fecharCaixa() {
    this.caixaService.fecharCaixa(this.data).subscribe(res => {
      this.notificationService.notificarCaixaAlterado();
      this._snackBar.open(res.entity, 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    })
  }

  ngOnInit(): void { }
}
