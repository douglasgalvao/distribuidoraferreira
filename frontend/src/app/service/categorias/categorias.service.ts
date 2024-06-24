import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProdutoElement } from "src/app/models/models";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  apiUrl: string = environment.apiUrl;

  obterCategorias(): Observable<any> {
    return this.http.get(this.apiUrl + '/categorias', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  verificarCategoriaExistente(nome: string): Observable<any> {
    return this.http.get(this.apiUrl + '/categorias/nome/' + nome, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  cadastrarCategoria(categoria: ProdutoElement) {
    return this.http.post(this.apiUrl + '/categorias', categoria, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteCategoria(id: number) {
    return this.http.delete(this.apiUrl + '/categorias/' + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
