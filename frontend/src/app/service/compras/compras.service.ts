import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicResponse, Compras, ComprasRequest } from 'src/app/models/models';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private http: HttpClient) { }

  apiUrl: string = environment.apiUrl;

  cadastrarCompra(compra: ComprasRequest): Observable<BasicResponse<Compras>> {
    return this.http.post<BasicResponse<Compras>>(this.apiUrl + '/compras', compra);
  }


  obterCompras(): Observable<BasicResponse<Compras[]>> {
    return this.http.get<BasicResponse<Compras[]>>(this.apiUrl + '/compras');
  }


}
