import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComandaElement } from 'src/app/models/models';
import { ClienteService } from 'src/app/service/cliente/cliente.service';
import { ComandasService } from 'src/app/service/comandas/comandas.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { DialogCreateComandaComponent } from './dialog-create-comanda/dialog-create-comanda.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.component.html',
  styleUrls: ['./comanda.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})

export class ComandaComponent implements OnInit, AfterViewInit {


  constructor(
    private comandasService: ComandasService,
    private clienteService: ClienteService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }



  comandas!: ComandaElement[];
  actions = [{
    icon: 'more',
    label: 'Comanda',
    menu: 'Nova Comanda',
    menuItems: [
      {
        icon: 'list_alt',
        label: 'Criar Comanda',
        action: () => {
          this.dialog.open(DialogCreateComandaComponent,
            {
              width: 'max-content',
              height: 'max-content',
              panelClass: '',
              enterAnimationDuration: '350ms',
              exitAnimationDuration: '350ms'
            });
        }
      }]
  }]


  ngAfterViewInit() {
    this.obterComandas();
  }

  ngOnInit(): void {
    this.notificationService.comandaCriada$.subscribe(() => this.obterComandas());
    this.notificationService.comandaAlterada$.subscribe(() => this.obterComandas());
    this.notificationService.comandaFinalizada$.subscribe(() => this.obterComandas());
  }


  obterComandas() {
    this.comandasService.getComanda().subscribe(
      (response) => {
        this.comandas = response.entity;
        this.comandas.forEach(
          e => {
            this.clienteService.obterClienteById(e.idCliente).subscribe(
              (response) => {
                e.nomeCliente = response.entity.nome_cliente;
                this.cdr.detectChanges();
              }
            )
          }
        )
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
