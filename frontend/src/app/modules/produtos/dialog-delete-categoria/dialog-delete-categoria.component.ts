import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from '../../../service/categorias/categorias.service';
import { NotificationService } from '../../../service/notifications/notifications.service';
import { CategoriaElement, ProdutoElement } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-delete-categoria',
  templateUrl: './dialog-delete-categoria.component.html',
  styleUrls: ['./dialog-delete-categoria.component.scss']
})
export class DialogDeleteCategoriaComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProdutoElement,
    private dialogRef: MatDialogRef<DialogDeleteCategoriaComponent>, private categoriaService: CategoriaService,
    private notificationService: NotificationService,
    private _snackBar: MatSnackBar) { }

  categoriaObject!: CategoriaElement;

  deleteCategoriaConfirm() {
    this.categoriaService.deleteCategoria(this.categoriaObject.id).subscribe(
      data => {
        this.notificationService.notificarCategoriaDeletada(this.categoriaObject.id);
        this._snackBar.open('Categoria deletada com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      error => console.error('Erro ao deletar categoria:', error)
    );
    this.dialogRef.close();
  }

  closeDialogConfirmation() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.categoriaObject = this.data;
  }

}
