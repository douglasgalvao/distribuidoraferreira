import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteResponse } from 'src/app/models/models';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';

@Component({
  selector: 'app-dialog-alterar-infos-cliente',
  templateUrl: './dialog-alterar-infos-cliente.component.html',
  styleUrls: ['./dialog-alterar-infos-cliente.component.scss']
})
export class AlterarInfosClienteComponent implements OnInit {
  form!: FormGroup;
  cliente!: ClienteResponse;
  idCliente!: number;

  constructor(public dialogRef: MatDialogRef<AlterarInfosClienteComponent>,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private matSnack: MatSnackBar,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { Cliente: ClienteResponse }) {}

  ngOnInit() {
    this.cliente = this.data.Cliente;
    this.idCliente = this.data.Cliente.id;
    this.form = this.fb.group({
      nome: [this.cliente.nome_cliente, Validators.required],
      telefone: [this.cliente.telefone, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]]
    });
   }

  abrirSnackBar(message: string, action: string) {
    this.matSnack.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  alterarCliente(): void {
    let request = {
      id: this.idCliente,
      nome_cliente: this.form.controls['nome'].value,
      telefone: this.form.controls['telefone'].value
    }
    
    this.clienteService.atualizarCliente(request).subscribe((res) => {
      this.notificationService.notificarClienteCriado();
      this.matSnack.open('Cliente atualizado com sucesso!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.dialogRef.close();
    },
      (error) => {
        this.matSnack.open('Erro ao atualizar dados do cliente. Tente novamente.', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.closeDialog();
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

}

