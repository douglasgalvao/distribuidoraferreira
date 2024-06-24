import { ProdutoElement, ProdutoElementRequest } from '../../../models/models';
import { Component, ViewChild, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../../service/notifications/notifications.service';
import { ProdutoService } from '../../../service/produtos/produtos.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteProdutoComponent } from '../dialog-delete-produto/dialog-delete-produto.component';
import { DialogEditProdutoComponent } from '../dialog-edit-produto/dialog-edit-produto.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DrawerService } from 'src/app/service/drawer/drawer.service';





@Component({
  selector: 'app-table-pagination-produto',
  templateUrl: './table-pagination-produto.component.html',
  styleUrls: ['./table-pagination-produto.component.scss']
})
export class TableProdutosCategoriasComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'preco', 'precoConsumo', 'categoria'];
  columAction: string = 'Editar';
  produtos: ProdutoElement[] = [];
  produtosRequest: ProdutoElementRequest[] = [];
  dataSource!: MatTableDataSource<ProdutoElementRequest>;
  isMobile: boolean = false;
  isMobileMinimo: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private produtosService: ProdutoService, private notificationService: NotificationService,
    private dialog: MatDialog, private breakpointObserver: BreakpointObserver, private drawer: DrawerService) {

  }


  openDialogEditProduto(produto: ProdutoElement) {
    this.dialog.open(DialogEditProdutoComponent, {
      data: produto,
      width: 'max-content',
      height: 'max-content',
      panelClass: '',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    });
  }

  openDialogDeleteProduto(produto: ProdutoElement) {
    this.dialog.open(DialogDeleteProdutoComponent, {
      data: produto,
      width: 'max-content',
      height: 'max-content',
      panelClass: '',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    });
  }

  formatarValorMonetario(valor: number): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return formatter.format(valor);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);

    this.dataSource.filter = normalizedFilter;

    this.dataSource.filterPredicate = (data: ProdutoElementRequest, filter: string) => {
      const dataStr = this.normalizeAccents(Object.values(data).join(' ').toLowerCase());
      return dataStr.includes(filter);
    };
  }

  normalizeAccents(input: string): string {
    const accentsMap: { [key: string]: string } = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
      'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
      'ã': 'a', 'õ': 'o',
      'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
      'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u'
    };

    return input.replace(/[áéíóúàèìòùãõâêîôûäëïöü]/g, match => accentsMap[match] || match);
  }



  updateTableByProdutos(produtos: ProdutoElement[]) {
    this.produtosRequest = produtos.map(produto => {
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
    this.dataSource = new MatTableDataSource<ProdutoElementRequest>(this.produtosRequest);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  updateTable() {
    this.produtos = [];
    this.produtosService.getProdutos().subscribe(
      data => {
        this.produtos = data.entity;
        this.produtosRequest = data.entity.map(produto => {
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
        this.dataSource = new MatTableDataSource<ProdutoElementRequest>(this.produtosRequest);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => console.error('Erro ao obter vendas:', error)
    );
  }


  updateTableByDelete(produtos: ProdutoElement[]) {
    this.produtos = produtos;
    this.dataSource = new MatTableDataSource<ProdutoElementRequest>(this.produtos.map(produto => {
      return {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        precoConsumo: produto.precoConsumo,
        img: produto.img,
        imgID: produto.imgID,
        subTotal: produto.subTotal,
        categoria: produto.categoria.nome.toUpperCase()
      };
    }));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {

    this.notificationService.produtoCriado$.subscribe(
      produto => {
        this.produtos.push(produto);
        this.updateTable();
      }
    );

    this.notificationService.produtoDeletado$.subscribe(
      produtoId => {
        this.produtos = this.produtos.filter(produto => produto.id !== produtoId);
        this.updateTableByDelete(this.produtos);
      }
    );

    this.updateTable();
    this.renderAccordingScreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }

  renderAccordingScreen() {
    let screenSize = window.innerWidth;
    if (screenSize < 500) {
      this.displayedColumns = ['nome', 'precoConsumo', 'actions'];
    } else if (screenSize >= 500 && screenSize < 800) {
      this.displayedColumns = ['nome', 'precoConsumo', 'categoria', 'actions'];
    } else if (screenSize >= 800) {
      this.displayedColumns = ['id', 'nome', 'img', 'preco', 'precoConsumo', 'categoria', 'actions'];
    }
  }

}
