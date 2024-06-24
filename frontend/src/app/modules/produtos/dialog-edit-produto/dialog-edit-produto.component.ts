import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from '../../../service/categorias/categorias.service';
import { NotificationService } from '../../../service/notifications/notifications.service';
import { CategoriaElement, ProdutoElement, ProdutoElementRequest } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-edit-produto',
  templateUrl: './dialog-edit-produto.component.html',
  styleUrls: ['./dialog-edit-produto.component.scss']
})
export class DialogEditProdutoComponent implements OnInit {



  categorias: CategoriaElement[] = [];
  produto: ProdutoElementRequest = this.data;
  form = this.fb.group({
    nome: ['', Validators.required],
    preco: [0, Validators.required],
    precoConsumo: [0, Validators.required],
    categoria: [0, Validators.required],
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProdutoElementRequest,
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private dialogRef: MatDialogRef<DialogEditProdutoComponent>,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.categoriaService.obterCategorias().subscribe((res) => {
      this.categorias = res.entity;
      let categoria = this.categorias.find(e => (e.nome.toUpperCase() == this.data.categoria.toUpperCase()));
      this.form.controls.categoria?.setValue(categoria?.id!);
      this.form.controls.nome?.setValue(this.produto.nome);
      this.form.controls.preco?.setValue(this.produto.preco);
      this.form.controls.precoConsumo?.setValue(this.produto.precoConsumo);
    });


  }

  saveProductEdited(e: any) {
  }

  closeEditDialog() {
    this.dialogRef.close();
  }


}
