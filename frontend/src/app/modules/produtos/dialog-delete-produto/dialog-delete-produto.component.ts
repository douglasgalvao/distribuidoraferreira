import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../../service/notifications/notifications.service';
import { ProdutoService } from '../../../service/produtos/produtos.service';
import { ProdutoElement } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-delete-produto',
  templateUrl: './dialog-delete-produto.component.html',
  styleUrls: ['./dialog-delete-produto.component.scss']
})
export class DialogDeleteProdutoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProdutoElement,
    private dialogRef: MatDialogRef<DialogDeleteProdutoComponent>,
    private produtoService: ProdutoService,
    private notificationService: NotificationService,
    private _snackBar: MatSnackBar) { }

  produtoObject!: ProdutoElement;

  deleteProdutoConfirm() {
    this.produtoService.getProdutoById(this.produtoObject.id).subscribe(produto => {
      this.produtoObject = produto.entity;

      if (produto.entity.imgID != null && produto.entity.imgID != "") {
        this.produtoService.deleteImage(produto.entity.imgID).subscribe(
          (data) => { }
        );
      }

      this.produtoService.deleteProduto(this.produtoObject.id).subscribe(
        (data) => {
          this.notificationService.notificarProdutoDeletado(data.entity.id);
          this._snackBar.open('Produto deletado com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.dialogRef.close();
        }
      );
    });
  }

  closeDialogConfirmation() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.produtoObject = this.data;

  }

}
