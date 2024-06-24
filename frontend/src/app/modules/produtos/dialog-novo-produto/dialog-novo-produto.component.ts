
// dialog-novo-produto.component.ts
import { AfterViewInit, Component, ElementRef, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { categoria_produto, ProdutoElement } from 'src/app/models/models';
import { ProdutoService } from 'src/app/service/produtos/produtos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from 'src/app/service/categorias/categorias.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
declare var page: any
@Component({
  selector: 'app-dialog-novo-produto',
  templateUrl: './dialog-novo-produto.component.html',
  styleUrls: ['./dialog-novo-produto.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})

export class DialogNovoProdutoComponent implements OnInit, AfterViewInit, OnChanges {
  gerarCodBarras: boolean = false;
  form!: FormGroup;
  existsPhoto: boolean = false;
  photoImgUrlAPI: string = '';
  nomeProdutoAPI: string = '';
  callAPIRequested: boolean = false;
  categorias!: categoria_produto[];
  fotoProduto!: File;
  fotoSelecionada: boolean = false;
  produtoJaExiste: boolean = true;
  produtoJaVerificada: boolean = false;
  produtoModificada: boolean = false;
  _verifyIfProductExists: boolean = false;
  @ViewChild('codBarrasElement') codBarrasInput!: ElementRef<HTMLInputElement>;



  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogNovoProdutoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private produtoService: ProdutoService,
    private notificationService: NotificationService,
    private _snackBar: MatSnackBar,
    private categoriaService: CategoriaService,
  ) {

    this.form = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      preco: ['', Validators.required],
      precoConsumo: ['', Validators.required],
      codBarras: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(13)]],
      // estoqueInicial: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['verifyIfProductExists'].currentValue == true) {
      this.handleProductExists();
    }
  }

  get verifyIfProductExists(): boolean {
    return this._verifyIfProductExists;
  }

  set verifyIfProductExists(value: boolean) {
    this._verifyIfProductExists = value;
    if (value) {
      this.handleProductExists();
    }
  }


  onInputPoint(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = this.formatCurrency(input.value);
  }

  formatCurrency(value: string): string {
    const num = this.getValorMonetario(value);

    if (isNaN(num)) {
      return '';
    }

    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getValorMonetario(value: string): number {
    value = value.replace(/[^\d]/g, '');

    while (value.length < 3) {
      value = '0' + value;
    }

    const integerPart = value.slice(0, -2);
    const fractionalPart = value.slice(-2);

    return parseFloat(integerPart + '.' + fractionalPart);
  }


  handleProductExists() {
    this.form.controls['codBarras'].setValue('');
    this.form.controls['codBarras'].setErrors({ 'incorrect': true });
    this._verifyIfProductExists = false;
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.codBarrasInput?.nativeElement.focus();
    }, 0);
  }

  ngOnInit(): void {
    this.categoriaService.obterCategorias().subscribe(
      (res) => {
        this.categorias = res.entity;
      }
    );

    this.form.get('codBarras')?.valueChanges.subscribe(value => {
      if (value.length === 13) {
        this.verificarProduto(value);
      }
    });

  }

  salvarFotoAtual(event: any) {
    this.fotoProduto = event.target.files[0] as File;
    this.fotoSelecionada = true;
  }

  cadastrarNovoProduto(produto: ProdutoElement) {
    if (!this.photoImgUrlAPI.length && this.fotoSelecionada) {
      this.produtoService.salvarImagemProduto(this.fotoProduto!).subscribe(
        res => {
          produto.preco = this.getValorMonetario(produto.preco.toString());
          produto.precoConsumo = this.getValorMonetario(produto.precoConsumo.toString());
          produto.img = res.entity.img;
          produto.imgID = res.entity.imgID;
          produto.codBarras = this.form.get('codBarras')?.value;
          // produto.quantidadeEstoque = this.form.value.estoqueInicial;
          this.produtoService.cadastrarNovoProduto(produto).subscribe(
            produto => {
              this.notificationService.notificarProdutoCriado(produto);
              this._snackBar.open('Produto cadastrado com sucesso!', 'Fechar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
              this.dialogRef.close(produto);
            }
          );
        }
      );
    } else if (this.photoImgUrlAPI.length && !this.fotoSelecionada) {
      produto.preco = parseFloat(produto.preco.toString().replace(',', '.'));
      produto.precoConsumo = parseFloat(produto.precoConsumo.toString().replace(',', '.'));
      produto.img = this.photoImgUrlAPI;
      produto.codBarras = this.form.get('codBarras')?.value;
      produto.estoque = this.form.value.estoqueInicial;
      this.produtoService.cadastrarNovoProduto(produto).subscribe(
        produto => {
          this.notificationService.notificarProdutoCriado(produto);
          this._snackBar.open('Produto cadastrado com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.dialogRef.close(produto);
        }
      );
    }
  }

  gerarCodBarrasProduto() {
    this.gerarCodBarras = true;
    this.form.get('codBarras')?.disable();
  }

  verificarProduto(codBarras: string) {
    this.produtoService.getProdutoByCodBarras(codBarras).subscribe(res => {
      if (res.status === 200) {
        this.verifyIfProductExists = true;
        this._snackBar.open('Código de Barras já cadastrado!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
      this.verifyIfProductExists = false;
    });
    return;
  }

  onInput(event: any) {
    event.target.value = event.target.value.replace(/[^\d]/g, '');
  }

  onInputNomeProduto(event: any) {
    event.target.value = event.target.value.trim();

    if (!event.target.value.match(/[a-zA-Z0-9 ]/)) {
      event.target.value = '';
      this.form['controls']['nome'].setErrors({ 'incorrect': true });
      return;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

