import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { AlterarDadosClienteRequest, BasicResponse, Cliente, ClienteRequest, ClienteResponse, VendaResponse } from "src/app/models/models";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  apiUrl: string = environment.apiUrl;

  cadastrarNovoCliente(cliente: ClienteRequest): Observable<BasicResponse<ClienteRequest>> {
    return this.http.post<BasicResponse<ClienteRequest>>(this.apiUrl + '/contas-cliente', cliente);
  }

  obterClientes(): Observable<BasicResponse<ClienteResponse[]>> {
    return this.http.get<BasicResponse<ClienteResponse[]>>(this.apiUrl + '/contas-cliente');
  }

  obterClienteById(id: Number): Observable<BasicResponse<ClienteResponse>> {
    return this.http.get<BasicResponse<ClienteResponse>>(this.apiUrl + '/contas-cliente/' + id);
  }

  obterClientesInadimplentes(): Observable<BasicResponse<ClienteResponse[]>> {
    return this.http.get<BasicResponse<ClienteResponse[]>>(this.apiUrl + '/contas-cliente/inadimplentes');
  }

  obterVendasCliente(id: Number): Observable<BasicResponse<VendaResponse[]>> {
    return this.http.get<BasicResponse<VendaResponse[]>>(this.apiUrl + "/vendas/cliente/" + id);
  }

  pagarContaCliente(id: Number, idVenda: Number, total_venda: Number, metodoPagamento: string): Observable<BasicResponse<string>> {
    let pagamentoRequest = { idCliente: id, idVenda: idVenda, valorPago: total_venda, metodoPagamento: metodoPagamento }
    console.log(pagamentoRequest)
    return this.http.post<BasicResponse<string>>(this.apiUrl + '/contas-cliente/pagar', pagamentoRequest);
  }

  atualizarCliente(dados: AlterarDadosClienteRequest): Observable<BasicResponse<ClienteResponse>> {
    let infosCliente = { idCliente: dados.id, nomeCliente: dados.nome_cliente, telefone: dados.telefone }
    return this.http.post<BasicResponse<ClienteResponse>>(this.apiUrl + '/contas-cliente/update', infosCliente);
  }
}
