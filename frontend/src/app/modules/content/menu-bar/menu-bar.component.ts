import { Component, HostListener, ViewChild } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { DrawerService } from 'src/app/service/drawer/drawer.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { ProdutoService } from 'src/app/service/produtos/produtos.service';
import { ProdutoElement, VendaElement, Vendas } from 'src/app/models/models';
import { MatDialog } from '@angular/material/dialog';
import { DialogVendasPendentesComponent } from './dialog-vendas-pendentes/dialog-vendas-pendentes.component';
import { VendasService } from 'src/app/service/vendas/vendas.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {

  isScrolled = false;
  showIcon!: boolean;
  produtoEstoqueBaixo: ProdutoElement[] = [];
  vendasStatusPendente: Vendas[] = [];
  @ViewChild('toolbar', { static: true }) toolbar!: MatToolbar;


  constructor(private drawerService: DrawerService,
    private produtoService: ProdutoService,
    private notificationService: NotificationService,
    private matDialog: MatDialog,
    private vendaService: VendasService) { }

  ngAfterViewInit(): void {
    const toolbarHeight = this.toolbar._elementRef.nativeElement.offsetHeight;

    const contentDiv = document.querySelector('.content') as HTMLElement;
    if (contentDiv) {
      contentDiv.style.height = `calc(100vh - ${toolbarHeight}px)`;
    }
  }



  ngOnInit(): void {
    this.renderAccordingScreen();
    this.renderProdutosBaixoEstoqueNotification();
    this.renderVendasPendentes();
    this.notificationService.baixoEstoqueDefinido$.subscribe(() => this.renderProdutosBaixoEstoqueNotification());
    this.notificationService.produtoCriado$.subscribe(() => this.renderProdutosBaixoEstoqueNotification());
    this.notificationService.produtoDeletado$.subscribe(() => this.renderProdutosBaixoEstoqueNotification());
    this.notificationService.compraCriada$.subscribe(() => this.renderProdutosBaixoEstoqueNotification());
    this.notificationService.vendaCriada$.subscribe(() => this.renderProdutosBaixoEstoqueNotification());
    this.notificationService.movimentacaoCriada$.subscribe(() => this.renderVendasPendentes())

  }

  renderProdutosBaixoEstoqueNotification() {
    this.produtoService.getProdutos().subscribe(
      produtos => {
        this.produtoEstoqueBaixo = produtos.entity.filter(produto => produto.estoque <= produto.estoqueMinimo);
      }
    );
  }


  renderVendasPendentes() {
    this.vendaService.obterVendasPendentes().subscribe(vendas => {
      this.vendasStatusPendente = vendas.entity;
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }

  renderAccordingScreen() {
    let screenSize = window.innerWidth;
    if (screenSize < 500) {
      this.showIcon = false;
    } else if (screenSize >= 500 && screenSize < 800) {
      this.showIcon = true;
    } else if (screenSize >= 800) {
      this.showIcon = true;
    }
  }


  openDialogVendasPendentes() {
    this.matDialog.open(DialogVendasPendentesComponent, {
      data: this.vendasStatusPendente,
      width: 'max-content',
      height: 'max-content',
      panelClass: '',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    });
  }

  toggleDrawer() {
    this.drawerService.toggleDrawer();
  }

  toggleDrawerIfMobile() {
    if (!this.showIcon)
    this.drawerService.toggleDrawer();
  }


}
