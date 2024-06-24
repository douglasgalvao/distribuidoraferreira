// dialog-nova-categoria.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaService } from 'src/app/service/categorias/categorias.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/service/notifications/notifications.service';

@Component({
  selector: 'app-dialog-nova-categoria',
  templateUrl: './dialog-nova-categoria.component.html',
  styleUrls: ['./dialog-nova-categoria.component.scss']
})
export class DialogNovaCategoriaComponent implements OnInit {


  form: FormGroup;
  categoriaJaExiste: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogNovaCategoriaComponent>,
    public categoriaService: CategoriaService,
    private notificationService: NotificationService,
    private _snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required]
    });
  }



  ngOnInit(): void {

  }

  cadastrarCategoria(): void {
    let nomeCategoria: string = this.form.value.nome;
    this.categoriaService.verificarCategoriaExistente(nomeCategoria).subscribe(
      (res) => {
        if (res.status == 200) {
          this._snackBar.open('Categoria já existe!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.categoriaJaExiste = true;
        } else {
          this.categoriaService.cadastrarCategoria(this.form.value).subscribe(
            (res) => {
              this.notificationService.notificarCategoriaCriada(this.form.value);
              this._snackBar.open('Categoria criada com sucesso!', 'Fechar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
              this.dialogRef.close(res);
            }
          );
        }
      }

    );

  }

  closeDialog(): void {
    this.dialogRef.close();
  }


}
