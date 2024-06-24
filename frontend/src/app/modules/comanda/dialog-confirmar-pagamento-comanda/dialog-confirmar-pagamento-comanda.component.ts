import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PagamentoComandaRequest } from 'src/app/models/models';
import { ComandasService } from 'src/app/service/comandas/comandas.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';

@Component({
  selector: 'app-dialog-confirmar-pagamento-comanda',
  templateUrl: './dialog-confirmar-pagamento-comanda.component.html',
  styleUrls: ['./dialog-confirmar-pagamento-comanda.component.scss']
})
export class DialogConfirmarPagamentoComandaComponent implements OnInit {


  comanda: any;
  idComanda!: number;
  valorTotal!: number;
  nomeCliente!: string;
  pagamentoForm: FormGroup;
  metodosPagamento: any[] = [
    { id: 'DINHEIRO', nome: 'DINHEIRO' },
    { id: 'PIX', nome: 'PIX' },
    { id: 'CREDITO', nome: 'CREDITO' },
    { id: 'DEBITO', nome: 'DEBITO' },
    { id: 'A_PAGAR', nome: 'A_PAGAR' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    public dialogRef: MatDialogRef<DialogConfirmarPagamentoComandaComponent>,
    public comandaService: ComandasService,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.comanda = data;
    this.pagamentoForm = this.fb.group({
      metodoComanda: [this.metodosPagamento[0].id, Validators.required]
    });
  }

  ngOnInit(): void {

    this.comanda.venda.filter((e: { status: string; }) => e.status == 'PENDENTE').map((e: { total_venda: number; }) => this.valorTotal = e.total_venda);

    this.idComanda = this.comanda.id;

    this.nomeCliente = this.comanda.nomeCliente;

  }


  confirmarPagamentoComanda() {

    let comanda: PagamentoComandaRequest = {
      metodoPagamento: this.pagamentoForm.value.metodoComanda,
      idComanda: this.idComanda
    }

    this.comandaService.pagarVendasComanda(comanda).subscribe((res) => {
      this.notificationService.notificarComandaFinalizada();
      this.snackBar.open(res.entity, 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.closeDialog();
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }


}
