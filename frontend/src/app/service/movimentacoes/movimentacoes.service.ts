import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicResponse, MovimentacoesEstoque, MovimentacoesEstoqueRequest } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class MovimentacoesService {

  constructor(private http: HttpClient) { }



  apiUrl = environment.apiUrl;

  getMovimentacoes(): Observable<BasicResponse<MovimentacoesEstoque[]>> {
    return this.http.get<any>(this.apiUrl + '/estoque/movimentacao', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } 
  

  postMovimentacao(movimentacao : any): Observable<BasicResponse<MovimentacoesEstoque>> {
    let movimentacaoRequest: MovimentacoesEstoqueRequest = {
      produto: movimentacao.produto.id,
      quantidade: movimentacao.quantidade,
      tipo: movimentacao.tipo,
      preco_unitario: movimentacao.valor,
      observacao: movimentacao.observacao
    }
    return this.http.post<any>(this.apiUrl + '/estoque/movimentacao', movimentacaoRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}
