import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteElement, ClienteResponse } from 'src/app/models/models';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { ComandasService } from 'src/app/service/comandas/comandas.service';

@Component({
  selector: 'app-dialog-create-comanda',
  templateUrl: './dialog-create-comanda.component.html',
  styleUrls: ['./dialog-create-comanda.component.scss']
})
export class DialogCreateComandaComponent implements OnInit {

  form: FormGroup;
  clientes: ClienteResponse[] = [];


  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private comandaService: ComandasService,
    private _snackBar: MatSnackBar,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<DialogCreateComandaComponent>,
  ) {
    this.form = this.fb.group({
      cliente: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.clienteService.obterClientes().subscribe(
      (res) => {
        console.log(res.entity)
        this.clientes = res.entity;
      }
    )
  }

  createComanda() {
    let request = {
      idCliente: this.form.controls['cliente'].value,
      status: 'ABERTA'
    }

    this.comandaService.criarComanda(request).subscribe(
      (res) => {
        this.notificationService.notificarComandaCriada();
        this._snackBar.open(res.entity, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.closeDialog();
      }
    )

  }

  closeDialog(): void {
    this.dialogRef.close();
  }



}
