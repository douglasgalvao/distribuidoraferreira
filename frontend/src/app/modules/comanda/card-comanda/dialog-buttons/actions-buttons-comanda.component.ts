import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DialogAddItemComandaComponent } from '../../dialog-add-item-comanda/dialog-add-item-comanda.component';
import { DialogListEditComandaComponent } from '../../dialog-list-edit-comanda/dialog-list-edit-comanda.component';
import { DialogFinalizarComandaComponent } from '../../dialog-finalizar-comanda/dialog-finalizar-comanda.component';
import { ActionButton } from 'src/app/models/models';


@Component({
  selector: 'app-actions-buttons-comanda',
  templateUrl: './actions-buttons-comanda.component.html',
  styleUrls: ['./actions-buttons-comanda.component.scss']
})


export class DialogActionComandaComponent implements OnInit {

  @Input() comanda: any;
  constructor(private dialog: MatDialog) { }

  dialogActions: ActionButton[] = [
    {
      title: 'Adicionar',
      icon: 'fastfood',
      action: () => {
        this.dialog.open(DialogAddItemComandaComponent, {
          data: this.comanda,
          width: 'max-content',
          height: 'max-content',
          panelClass: '',
          enterAnimationDuration: '350ms',
          exitAnimationDuration: '350ms'
        });
      },
    },
    {
      title: 'List/Edit',
      icon: 'edit',
      action: () => {
        this.dialog.open(DialogListEditComandaComponent, {
          data: this.comanda,
          width: 'max-content',
          height: 'max-content',
          panelClass: '',
          enterAnimationDuration: '350ms',
          exitAnimationDuration: '350ms'
        });
      },
    },
    {
      title: 'Finalizar',
      icon: 'check_circle',
      action: () => {
        this.dialog.open(DialogFinalizarComandaComponent, {
          data: this.comanda,
          width: 'max-content',
          height: 'max-content',
          panelClass: '',
          enterAnimationDuration: '350ms',
          exitAnimationDuration: '350ms'
        });
      },
    },
  ];



  ngOnInit(): void {

  }

}


