import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { caixaRequest } from 'src/app/models/models';
import { CaixaService } from 'src/app/service/caixa/caixa.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';

@Component({
  selector: 'app-dialog-set-valor-init-caixa',
  templateUrl: './dialog-set-valor-init-caixa.component.html',
  styleUrls: ['./dialog-set-valor-init-caixa.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class DialogSetValorInitCaixaComponent {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogSetValorInitCaixaComponent>,
    private caixaService: CaixaService,
    private notification: NotificationService
  ) {
    this.form = this.fb.group({
      valor_inicial: ['', Validators.required]
    });
  }

  abrirCaixa(value: any) {

    // const valorFormatado = value.valor_inicial.replace('.', '').replace(',', '.');

    this.caixaService.setValorInicial(value).subscribe((res) => {
      this.notification.notificarCaixaAlterado();
      this.closeDialog();
    });
  }

  onInputPoint(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = this.formatCurrency(input.value);
  }

  formatCurrency(value: string): string {
    const num = this.getValorMonetario(value);

    if (isNaN(num)) {
      return '';
    }

    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getValorMonetario(value: string): number {
    value = value.replace(/[^\d]/g, '');

    while (value.length < 3) {
      value = '0' + value;
    }

    const integerPart = value.slice(0, -2);
    const fractionalPart = value.slice(-2);

    return parseFloat(integerPart + '.' + fractionalPart);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
