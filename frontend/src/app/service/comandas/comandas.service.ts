import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicResponse, ComandaRequestAddItens, PagamentoComandaRequest, Vendas, VendasRequest } from 'src/app/models/models';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ComandasService {

  constructor(private http: HttpClient) { }
  apiUrl: string = environment.apiUrl;

  getComanda(): Observable<BasicResponse<any>> {
    return this.http.get<BasicResponse<any>>(this.apiUrl + '/comanda');
  }

  criarComanda(request: any): Observable<BasicResponse<string>> {
    return this.http.post<BasicResponse<string>>(this.apiUrl + '/comanda', request);
  }

  pagarVendasComanda(comanda: PagamentoComandaRequest): Observable<BasicResponse<string>> {
    return this.http.post<BasicResponse<string>>(this.apiUrl + '/comanda/concluir/vendas', comanda);
  }

  finalizarComanda(idComanda: number) {
    return this.http.post<BasicResponse<string>>(this.apiUrl + '/comanda/fechar/' + idComanda, {});
  }



  adicionarItemComanda(idComanda: number, itens: ComandaRequestAddItens[]): Observable<BasicResponse<string>> {
    return this.http.post<BasicResponse<string>>(this.apiUrl + '/comanda/itens/adicionar/' + idComanda, itens);
  }

}