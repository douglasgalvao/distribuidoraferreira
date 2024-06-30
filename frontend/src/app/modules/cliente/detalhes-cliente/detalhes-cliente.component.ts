import { Component, OnInit, Input, Output, EventEmitter, Inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { ClienteResponse, VendaResponse } from 'src/app/models/models';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';

@Component({
  selector: 'app-detalhes-cliente',
  templateUrl: './detalhes-cliente.component.html',
  styleUrls: ['./detalhes-cliente.component.scss']
})
export class DetalhesClienteComponent implements OnInit, AfterViewInit {
  clienteForm!: FormGroup;
  cliente!: ClienteResponse;
  vendasData!: VendaResponse[];
  dataSource!: MatTableDataSource<VendaResponse>;
  isLoaded!: boolean;
  isLoading!: boolean;

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { Cliente: ClienteResponse },
    private notificationService: NotificationService,
    private clienteService: ClienteService
  ) { }


  ngAfterViewInit(): void {
    this.notificationService.contaPaga$.subscribe(e => this.cliente.id = e);
  }


  ngOnInit(): void {
    this.isLoaded = false;
    this.isLoading = !this.isLoaded;
    this.cliente = this.data.Cliente;
    forkJoin({
      obterClienteById: this.clienteService.obterVendasCliente(this.cliente.id),
    }).subscribe(({ obterClienteById }) => {
      this.vendasData = obterClienteById.entity;
      this.vendasData.forEach((venda) => {
        venda.data_hora = new Date(venda.data_hora).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date(venda.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      })
      this.dataSource = new MatTableDataSource(this.vendasData);
      this.isLoaded = true;
      this.isLoading = !this.isLoaded;
    });

    this.clienteForm = this.fb.group({
      nome_cliente: [this.cliente.nome_cliente, Validators.required],
      telefone: [this.cliente.telefone, Validators.required]
    });

  }

  obterInfosCliente(id: number): void {

  }

}