import { CategoriaElement, CategoriaElementRequest, ProdutoElement, ProdutoElementRequest } from '../../../models/models';
import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../../service/notifications/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaService } from '../../../service/categorias/categorias.service';
import { DialogDeleteCategoriaComponent } from '../dialog-delete-categoria/dialog-delete-categoria.component';





@Component({
  selector: 'app-table-pagination-categoria',
  templateUrl: './table-pagination-categoria.component.html',
  styleUrls: ['./table-pagination-categoria.component.scss']
})
export class TableCategoriasProdutosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome'];
  columAction: string = 'Actions';
  categorias: CategoriaElement[] = [];
  categoriasRequest: CategoriaElementRequest[] = [];
  dataSource!: MatTableDataSource<CategoriaElement>;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private categoriaService: CategoriaService, private notificationService: NotificationService,
    private dialog: MatDialog) { }

  openDialogDeleteCategoria(categoria: CategoriaElement) {
    this.dialog.open(DialogDeleteCategoriaComponent, {
      data: categoria,
      width: 'max-content',
      height: 'max-content',
      panelClass: '',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const normalizedFilter = this.normalizeAccents(filterValue);

    this.dataSource.filter = normalizedFilter;

    this.dataSource.filterPredicate = (data: CategoriaElement, filter: string) => {
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


  updateTable() {
    this.categorias = [];
    this.categoriaService.obterCategorias().subscribe(
      data => {
        this.categorias = data.entity as CategoriaElement[];
        this.categorias = this.categorias.map(categoria => {
          return {
            id: categoria.id,
            nome: categoria.nome.toUpperCase()
          };
        });


        this.dataSource = new MatTableDataSource<CategoriaElement>(this.categorias);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => console.error('Erro ao obter Categorias:', error)
    );
  }


  updateTableByDelete(categorias: CategoriaElement[]) {
    this.categorias = categorias;
    this.dataSource = new MatTableDataSource<CategoriaElement>(this.categorias.map(produto => {
      return {
        id: produto.id,
        nome: produto.nome.toUpperCase()
      };
    }));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  ngOnInit(): void {

    this.notificationService.categoriaCriada$.subscribe(
      categoria => {
        this.categorias.push(categoria);
        this.updateTable();
      }
    );

    this.notificationService.categoriaDeletada$.subscribe(
      categoriaId => {
        this.categorias = this.categorias.filter(categoria => categoria.id !== categoriaId);
        this.updateTableByDelete(this.categorias);
      }
    );

    this.updateTable();
  }
}
