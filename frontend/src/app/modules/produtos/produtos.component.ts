import { DrawerService } from 'src/app/service/drawer/drawer.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { DialogNovoProdutoComponent } from './dialog-novo-produto/dialog-novo-produto.component';
import { MatDialog } from '@angular/material/dialog';
import { ProdutoService } from 'src/app/service/produtos/produtos.service';
import { DialogNovaCategoriaComponent } from './dialog-nova-categoria/dialog-nova-categoria.component';
import { CategoriaElement, CategoriaElementRequest, ProdutoElement, ProdutoElementRequest } from 'src/app/models/models';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { forkJoin } from 'rxjs';
import { CategoriaService } from 'src/app/service/categorias/categorias.service';


@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})





export class ProdutosComponent implements OnInit, AfterViewInit {


  produtos: ProdutoElement[] = [];
  produtosRequest: ProdutoElementRequest[] = [];
  dataSourceProduto!: MatTableDataSource<ProdutoElementRequest>;

  categorias: CategoriaElement[] = [];
  categoriasRequest: CategoriaElementRequest[] = [];
  dataSourceCategoria!: MatTableDataSource<CategoriaElement>;

  toolbarTitle = 'Produtos e Categorias';
  actions = [
    {
      icon: 'flip_to_front',
      label: 'Novo',
      menu: 'novoProduto',
      menuItems: [
        {
          icon: 'fastfood',
          label: 'Novo Produto',
          action: () => this.abrirDialogNovoProduto(),
        },
        {
          icon: 'bookmark',
          label: 'Nova Categoria',
          action: () => this.abrirDialogNovaCategoria(),
        }
      ],
    }
  ];
  isLoaded!: boolean;
  isLoading!: boolean;




  constructor(
    private dialog: MatDialog,
    private produtosService: ProdutoService,
    private categoriaService: CategoriaService,
    private notificationService: NotificationService
  ) { }


  ngAfterViewInit(): void {}


  ngOnInit(): void {


    this.isLoaded = false;
    this.isLoading = !this.isLoaded;
    forkJoin({
      produtos: this.produtosService.getProdutos(),
      categorias: this.categoriaService.obterCategorias()
    }).subscribe(({ produtos, categorias }) => {
      this.produtos = produtos.entity;
      this.produtosRequest = produtos.entity.map(produto => {
        return {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          precoConsumo: produto.precoConsumo,
          subTotal: produto.subTotal,
          img: produto.img,
          imgID: produto.imgID,
          categoria: produto.categoria.nome.toUpperCase()
        };
      });

      this.categorias = categorias.entity;
      this.categorias = this.categorias.map(categoria => {
        return {
          id: categoria.id,
          nome: categoria.nome.toUpperCase()
        };
      });

      this.dataSourceCategoria = new MatTableDataSource<CategoriaElement>(this.categorias);
      this.dataSourceProduto = new MatTableDataSource<ProdutoElementRequest>(this.produtosRequest);
      this.isLoaded = true;
      this.isLoading = !this.isLoaded;
    });

    this.notificationService.produtoCriado$.subscribe(
      produto => {
        this.produtos.push(produto);
        this.ngAfterViewInit();
      }
    );

    this.notificationService.produtoDeletado$.subscribe(
      produtoId => {
        this.produtos = this.produtos.filter(produto => produto.id !== produtoId);
        this.ngAfterViewInit();
      }
    );

    this.notificationService.categoriaCriada$.subscribe(
      categoria => {
        this.categorias.push(categoria);
        this.ngAfterViewInit();
      }
    );

    this.notificationService.categoriaDeletada$.subscribe(
      categoriaId => {
        this.categorias = this.categorias.filter(categoria => categoria.id !== categoriaId);
        this.ngAfterViewInit();
      }
    );
  }


  abrirDialogNovoProduto() {
    this.dialog.open(DialogNovoProdutoComponent, {
      width: 'max-content',
      height: 'max-content',
      panelClass: '',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    });
  }

  abrirDialogNovaCategoria() {
    this.dialog.open(DialogNovaCategoriaComponent, {
      width: 'max-content',
      height: 'max-content',
      panelClass: '',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    });
  }

  abrirDialogDeleteProduto(produto: ProdutoElement) {
    this.dialog.open(DialogNovoProdutoComponent, {
      data: produto,
      width: 'max-content',
      height: 'max-content',
      panelClass: '',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    });
  }


}
