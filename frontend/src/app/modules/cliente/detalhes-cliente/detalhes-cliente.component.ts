import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClienteResponse } from 'src/app/models/models';
import { ClienteService } from 'src/app/service/cliente/cliente.service';

@Component({
  selector: 'app-detalhes-cliente',
  templateUrl: './detalhes-cliente.component.html',
  styleUrls: ['./detalhes-cliente.component.scss']
})
export class DetalhesClienteComponent implements OnInit {
  clienteForm!: FormGroup;
  cliente!: ClienteResponse;

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { Cliente: ClienteResponse }
  ) { }

  ngOnInit(): void {
    this.cliente = this.data.Cliente;
    this.clienteForm = this.fb.group({
      nome_cliente: [this.cliente.nome_cliente, Validators.required],
      telefone: [this.cliente.telefone, Validators.required]
    });

  }

  obterInfosCliente(id: number): void{
    
  }
}