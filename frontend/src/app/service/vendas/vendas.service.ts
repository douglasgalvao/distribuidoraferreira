import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicResponse, Vendas, VendasRequest } from 'src/app/models/models';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VendasService {

  constructor(private http: HttpClient) { }
  apiUrl: string = environment.apiUrl;



  cadastrarVenda(venda: VendasRequest): Observable<BasicResponse<Vendas>> {
    return this.http.post<BasicResponse<Vendas>>(this.apiUrl + '/vendas', venda, { responseType: 'json' });
  }

  obterVendasByComanda(comanda: number): Observable<BasicResponse<any[]>> {
    return this.http.get<BasicResponse<any[]>>(this.apiUrl + '/vendas/comanda/' + comanda, { responseType: 'json' });
  }


  obterVendasPendentes(): Observable<BasicResponse<Vendas[]>> {
    return this.http.get<BasicResponse<Vendas[]>>(this.apiUrl + '/vendas/pendentes', { responseType: 'json' });
  }

  obterVendasPendentesPorCliente(cliente: number): Observable<BasicResponse<Vendas[]>> {
    return this.http.get<BasicResponse<Vendas[]>>(this.apiUrl + '/vendas/cliente/' + cliente, { responseType: 'json' });
  }

  obterVendas(): Observable<BasicResponse<Vendas[]>> {
    return this.http.get<BasicResponse<Vendas[]>>(this.apiUrl + '/vendas', { responseType: 'json' });
  }


  obterVendasOrderByDataHora(): Observable<BasicResponse<Vendas[]>> {
    return this.http.get<BasicResponse<Vendas[]>>(this.apiUrl + '/vendas/sort', { responseType: 'json' });
  }





}
