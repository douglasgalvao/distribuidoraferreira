import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';

@Component({
  selector: 'app-dialog-confirmar-pagamento',
  templateUrl: './dialog-confirmar-pagamento.component.html',
  styleUrls: ['./dialog-confirmar-pagamento.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class DialogConfirmarPagamentoComponent implements OnInit {
  form!: FormGroup;
  valor!: number;
  idVenda!: number;
  vendas: any = []
  id_cliente!: Number;
  metodosPagamento: any[] = [
    { id: 'DINHEIRO', nome: 'DINHEIRO' },
    { id: 'PIX', nome: 'PIX' },
    { id: 'CREDITO', nome: 'CREDITO' },
    { id: 'DEBITO', nome: 'DEBITO' },
    { id: 'A_PAGAR', nome: 'A_PAGAR' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogConfirmarPagamentoComponent>,
    private clienteService: ClienteService,
    private matSnack: MatSnackBar,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public venda: any
  ) { }

  ngOnInit() {
    
    this.vendas = this.venda;
    this.valor = this.vendas[0].total_venda;
    this.idVenda = this.vendas[0].id;
    this.id_cliente = this.vendas[1];

    console.log(this.venda)

    this.form = this.fb.group({
      total_venda: [(this.venda[0].total_venda - this.venda[0].total_pago), Validators.required],
      metodoComanda: [this.metodosPagamento[0].id, Validators.required]
    });
  }

  pagarContaCliente(form: any): void {
    let total_venda = String(form.total_venda);

    if (total_venda.includes(',')) {
      total_venda = total_venda.replace(/,/g, '.');
    }

    let total_venda_number = parseFloat(total_venda);

    this.clienteService.pagarContaCliente(this.id_cliente, this.idVenda, total_venda_number, this.form.controls['metodoComanda'].value).subscribe(e => {
      
      this.notificationService.notificarContaPaga();
      this.matSnack.open(e.entity, 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.dialogRef.close();
    },
      (error) => {
        this.matSnack.open(error.entity, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.closeDialog();
      })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
