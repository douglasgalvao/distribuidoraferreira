import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicResponse, caixaRequest, caixaResponse } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class CaixaService {

  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) { }

  setValorInicial(data: caixaRequest): Observable<BasicResponse<any>> {
    return this.http.post<BasicResponse<any>>(this.apiUrl + '/caixa/abrir', data);
  }

  verificarCaixa(): Observable<BasicResponse<any>> {
    return this.http.get<BasicResponse<any>>(this.apiUrl + '/caixa/verificar');
  }

  getCaixaID(): Observable<BasicResponse<any>> {
    return this.http.get<BasicResponse<any>>(this.apiUrl + '/caixa/pegarID')
  }

  getCaixaById(id: number): Observable<BasicResponse<any>> {
    return this.http.get<BasicResponse<any>>(this.apiUrl + '/caixa/' + id);
  }

  getDetalhesCaixaById(id: number): Observable<BasicResponse<any>> {
    return this.http.get<BasicResponse<any>>(this.apiUrl + '/caixa/detalhes/' + id);
  }


  getCaixa(): Observable<BasicResponse<any>> {
    return this.http.get<BasicResponse<any>>(this.apiUrl + '/caixa/aberto');
  }

  getCaixas(): Observable<BasicResponse<any>> {
    return this.http.get<BasicResponse<any>>(this.apiUrl + '/caixa');
  }

  fecharCaixa(id: number): Observable<BasicResponse<any>> {
    return this.http.post<BasicResponse<any>>(this.apiUrl + '/caixa/fechar/' + id, {});
  }

}
