import { DrawerService } from 'src/app/service/drawer/drawer.service';
import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { DialogNovoProdutoComponent } from './dialog-novo-produto/dialog-novo-produto.component';
import { MatDialog } from '@angular/material/dialog';
import { ProdutoService } from 'src/app/service/produtos/produtos.service';
import { DialogNovaCategoriaComponent } from './dialog-nova-categoria/dialog-nova-categoria.component';
import { ProdutoElement } from 'src/app/models/models';


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



export class ProdutosComponent {
  constructor(private dialog: MatDialog, private produtoService: ProdutoService,private drawer:DrawerService) { 
    

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
}
