import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from '../../../service/categorias/categorias.service';
import { NotificationService } from '../../../service/notifications/notifications.service';
import { CategoriaElement, ProdutoElement, ProdutoElementRequest } from 'src/app/models/models';
import { ProdutoService } from 'src/app/service/produtos/produtos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-edit-produto',
  templateUrl: './dialog-edit-produto.component.html',
  styleUrls: ['./dialog-edit-produto.component.scss']
})
export class DialogEditProdutoComponent implements OnInit {


  isLoaded!: boolean;
  isLoading!: boolean;
  categorias: CategoriaElement[] = [];
  existsPhoto: boolean = false;
  fotoSelecionada: boolean = false;
  fotoProduto: File = new File([], '');
  produto: ProdutoElementRequest = this.data;
  form = this.fb.group({
    nome: ['', Validators.required],
    preco: ['', Validators.required],
    precoConsumo: ['', Validators.required],
    categoria: [0, Validators.required]
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProdutoElementRequest,
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private dialogRef: MatDialogRef<DialogEditProdutoComponent>,
    private produtoService: ProdutoService,
    private notificationService: NotificationService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.isLoaded = false;
    this.isLoading = !this.isLoaded;

    this.categoriaService.obterCategorias().subscribe((res) => {
      this.categorias = res.entity;
      let categoria = this.categorias.find(e => (e.nome.toUpperCase() == this.data.categoria.toUpperCase()));
      this.form.controls.categoria?.setValue(categoria?.id!);
      this.form.controls.nome?.setValue(this.produto.nome);
      this.form.controls.preco?.setValue(this.produto.preco.toFixed(2));
      this.form.controls.precoConsumo?.setValue(this.produto.precoConsumo.toFixed(2));

      this.isLoaded = true;
      this.isLoading = !this.isLoaded;
    });

  }


  formatCurrency(value: string): string {
    const num = this.getValorMonetario(value);

    if (isNaN(num)) {
      return '';
    }

    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }


  onInputPoint(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = this.formatCurrency(input.value);
  }

  salvarFotoAtual(event: any) {
    this.fotoProduto = event.target.files[0] as File;
    this.fotoSelecionada = true;
  }

  getValorMonetario(value: string): number {
    value = value.toString().replace(/[^\d]/g, '');

    while (value.length <= 3) {
      value = '0' + value;
    }

    const integerPart = value.slice(0, -2);
    const fractionalPart = value.slice(-2);

    return parseFloat(integerPart + '.' + fractionalPart);
  }

  saveProductEdited(e: any) {
    this.isLoaded = false;
    this.isLoading = !this.isLoaded;
    if (this.fotoSelecionada) {
      this.produtoService.salvarImagemProduto(this.fotoProduto!).subscribe(
        res => {
          this.produto.nome = e.nome;
          this.produto.preco = this.getValorMonetario(e.preco);
          this.produto.precoConsumo = this.getValorMonetario(e.precoConsumo);
          this.produto.img = res.entity.img;
          this.produto.imgID = res.entity.imgID;
          this.produto.categoria = this.data.categoria;
          this.produtoService.atualizarProduto(this.produto).subscribe(
            res => {
              this._snackBar.open('Produto atualizado com sucesso!', 'Fechar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
              this.notificationService.notificarProdutoAtualizado(res);
              this.isLoaded = true;
              this.isLoading = !this.isLoaded;
              this.dialogRef.close();
            }
          );
        }
      );
    } else {
      this.produto.preco = this.getValorMonetario(e.preco);
      this.produto.precoConsumo = this.getValorMonetario(e.precoConsumo);
      this.produto.categoria = this.data.categoria;
      this.produto.nome = e.nome;

      this.produtoService.atualizarProduto(this.produto).subscribe(
        res => {
          this._snackBar.open('Produto atualizado com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.notificationService.notificarProdutoAtualizado(res);
          this.isLoaded = true;
          this.isLoading = !this.isLoaded;
          this.dialogRef.close();
        }
      );
    }


  }

  closeEditDialog() {
    this.dialogRef.close();
  }


}
