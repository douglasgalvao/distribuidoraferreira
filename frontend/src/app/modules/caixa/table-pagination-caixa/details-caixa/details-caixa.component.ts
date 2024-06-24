import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Caixa, CaixaDetails } from 'src/app/models/models';
import { CaixaService } from 'src/app/service/caixa/caixa.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';

@Component({
  selector: 'app-details-caixa',
  templateUrl: './details-caixa.component.html',
  styleUrls: ['./details-caixa.component.scss']
})
export class DetailsCaixaComponent implements OnInit {
  form!: FormGroup;
  caixa!: any;
  caixaDetails: CaixaDetails = {
    contaCliente: 0.0,
    credito: 0.0,
    debito: 0.0,
    dinheiro: 0.0,
    pix: 0.0
  };

  constructor(public dialogRef: MatDialogRef<DetailsCaixaComponent>,
    private matSnack: MatSnackBar,
    private caixaService: CaixaService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.caixa = data;
  }



  ngOnInit() {
    this.caixaService.getDetalhesCaixaById(this.caixa.caixa_id).subscribe((details) => {
      this.caixaDetails = details.entity;
    });

  }

  abrirSnackBar(message: string, action: string) {
    this.matSnack.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }



  closeDialog() {
    this.dialogRef.close();
  }
}

