// notification.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ProdutoElement, MovimentacoesEstoque, Compras, Cliente } from 'src/app/models/models';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private produtoDeletadoSource = new Subject<number>();
  private produtoCriadoSource = new Subject<ProdutoElement>();

  private categoriaDeletadaSource = new Subject<number>();
  private categoriaCriadaSource = new Subject<ProdutoElement>();

  private movimentacaoSource = new Subject<MovimentacoesEstoque>();

  private compraCriadaSource = new Subject<Boolean>();

  private vendaCriadaSource = new Subject<Boolean>();

  private estoqueRemovidoSource = new Subject<number>();
  private estoqueAdicionadoSource = new Subject<ProdutoElement>();

  private baixoEstoqueDefinidoSource = new Subject<ProdutoElement>();

  private caixaAlterado = new Subject<Boolean>();

  private clienteCriadoSource = new Subject<Boolean>();

  private comandaCriadaSource = new Subject<Boolean>();

  private comandaAlteradaSource = new Subject<Boolean>();

  private comandaFinalizadaSource = new Subject<Boolean>();

  private contaPagaSource = new Subject<Boolean>();


  produtoCriado$ = this.produtoCriadoSource.asObservable();
  produtoDeletado$ = this.produtoDeletadoSource.asObservable();

  comandaCriada$ = this.comandaCriadaSource.asObservable();
  comandaAlterada$ = this.comandaAlteradaSource.asObservable();
  comandaFinalizada$ = this.comandaFinalizadaSource.asObservable();

  caixaAlterado$ = this.caixaAlterado.asObservable();

  categoriaCriada$ = this.categoriaCriadaSource.asObservable();
  categoriaDeletada$ = this.categoriaDeletadaSource.asObservable();

  baixoEstoqueDefinido$ = this.baixoEstoqueDefinidoSource.asObservable();

  estoqueAdicionado$ = this.estoqueAdicionadoSource.asObservable();
  estoqueRemovido$ = this.estoqueRemovidoSource.asObservable();

  movimentacaoCriada$ = this.movimentacaoSource.asObservable();

  compraCriada$ = this.compraCriadaSource.asObservable();

  vendaCriada$ = this.vendaCriadaSource.asObservable();

  clienteCriado$ = this.clienteCriadoSource.asObservable();

  contaPaga$ = this.contaPagaSource.asObservable();

  constructor() { }

  notificarProdutoDeletado(produtoId: number) {
    this.produtoDeletadoSource.next(produtoId);
  }

  notificarProdutoCriado(produto: ProdutoElement) {
    this.produtoCriadoSource.next(produto);
  }

  notificarCategoriaDeletada(categoriaId: number) {
    this.categoriaDeletadaSource.next(categoriaId);
  }

  notificarCategoriaCriada(categoria: ProdutoElement) {
    this.categoriaCriadaSource.next(categoria);
  }

  notificarBaixoEstoqueDefinido(produto: ProdutoElement) {
    this.baixoEstoqueDefinidoSource.next(produto);
  }

  notificarEstoqueAdicionado(produtoId: ProdutoElement) {
    this.estoqueAdicionadoSource.next(produtoId);
  }

  notificarMovimentacaoCriada(movimentacao: MovimentacoesEstoque) {
    this.movimentacaoSource.next(movimentacao);
  }

  notificarCompraCriada() {
    this.compraCriadaSource.next(true);
  }

  notificarVendaCriada() {
    this.vendaCriadaSource.next(true);
  }

  notificarCaixaAlterado() {
    this.caixaAlterado.next(true);
  }

  notificarClienteCriado() {
    this.clienteCriadoSource.next(true);
  }

  notificarContaPaga() {
    this.contaPagaSource.next(true);
  }

  notificarComandaCriada() {
    this.comandaCriadaSource.next(true);
  }

  notificarComandaAlterada() {
    this.comandaAlteradaSource.next(true);
  }

  notificarComandaFinalizada() {
    this.comandaFinalizadaSource.next(true);
  }
}
