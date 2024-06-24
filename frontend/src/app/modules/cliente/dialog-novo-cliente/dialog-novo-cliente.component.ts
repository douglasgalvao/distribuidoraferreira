import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';

@Component({
  selector: 'app-dialog-novo-cliente',
  templateUrl: './dialog-novo-cliente.component.html',
  styleUrls: ['./dialog-novo-cliente.component.scss']
})
export class DialogNovoClienteComponent implements OnInit {
  form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogNovoClienteComponent>,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private matSnack: MatSnackBar,
    private notificationService: NotificationService) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]]
    });
  }

  ngOnInit() { }

  abrirSnackBar(message: string, action: string) {
    this.matSnack.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  cadastrarNovoCliente(): void {
    let request = {
      nome_cliente: this.form.controls['nome'].value,
      telefone: this.form.controls['telefone'].value
    }

    this.clienteService.cadastrarNovoCliente(request).subscribe((res) => {
      this.notificationService.notificarClienteCriado();
      this.matSnack.open('Cliente cadastrado com sucesso!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.dialogRef.close();
    },
      (error) => {
        this.matSnack.open('Erro ao cadastrar cliente. Tente novamente.', 'Fechar', {
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
