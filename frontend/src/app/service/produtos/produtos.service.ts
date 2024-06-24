import { BasicResponse, ProdutoElement } from 'src/app/models/models';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProdutoFileIdResponse } from 'src/app/models/models';
import { DOC_ORIENTATION, DataUrl, NgxImageCompressService } from 'ngx-image-compress';


@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private http: HttpClient, private imageCompress: NgxImageCompressService) { }

  apiUrl = environment.apiUrl;

  getProdutos(): Observable<BasicResponse<ProdutoElement[]>> {
    return this.http.get<BasicResponse<ProdutoElement[]>>(this.apiUrl + '/produtos', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  cadastrarNovoProduto(produto: ProdutoElement): Observable<ProdutoElement> {

    return this.http.post<ProdutoElement>(this.apiUrl + '/produtos', {
      codBarras: produto.codBarras,
      nome: produto.nome,
      preco: produto.preco,
      precoConsumo: produto.precoConsumo,
      estoque: produto.estoque,
      img: produto.img,
      imgID: produto.imgID,
      categoria: produto.categoria
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }


  compressImageFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = reader.result as DataUrl;
        const orientation = DOC_ORIENTATION.NotDefined;

        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        const QUALITY = 50;

        this.imageCompress
          .compressFile(image, orientation, 50, QUALITY, MAX_WIDTH, MAX_HEIGHT)
          .then(
            (compressedImage: string) => {
              resolve(compressedImage);
            },
            (error) => {
              reject('Image compression failed: ' + error);
            }
          );
      };
      reader.onerror = (error) => reject('File reading failed: ' + error);
      reader.readAsDataURL(file);
    });
  }

  salvarImagemProduto(fotoProduto: File): Observable<BasicResponse<ProdutoFileIdResponse>> {
    const endpoint = this.apiUrl + '/produtos/upload';
    const formData: FormData = new FormData();

    return new Observable((observer) => {
      this.compressImageFile(fotoProduto).then((compressedImage) => {
        const blob = this.dataURItoBlob(compressedImage);
        const compressedFile = new File([blob], fotoProduto.name, { type: 'image/jpeg' });

        formData.append('img', compressedFile);

        this.http.post<BasicResponse<ProdutoFileIdResponse>>(endpoint, formData).subscribe(
          (response) => {
            observer.next(response);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  getProdutoByNome(nome: string): Observable<boolean> {
    return this.http.get<boolean>(this.apiUrl + '/produtos/nome/' + nome, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  getProdutoByCodBarras(codBarras: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/produtos/cod/' + codBarras, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }


  atualizarProduto(produto: ProdutoElement): Observable<ProdutoElement> {
    return this.http.put<ProdutoElement>(this.apiUrl + '/produtos', {
      id: produto.id,
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      precoConsumo: produto.precoConsumo,
      img: produto.img,
      codBarras: produto.codBarras
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  deleteProduto(id: number): Observable<BasicResponse<ProdutoElement>> {
    return this.http.delete<BasicResponse<ProdutoElement>>(this.apiUrl + '/produtos/' + id);
  }

  deleteImage(id: string): Observable<BasicResponse<ProdutoElement>> {
    return this.http.delete<BasicResponse<ProdutoElement>>(this.apiUrl + '/produtos/deleteImage/' + id);
  }

  definirBaixoEstoque(idProduto: number, quantidade: number): Observable<string> {
    return this.http.put<string>(this.apiUrl + '/produtos/estoquemin', {
      idProduto: idProduto,
      estoqueMinimo: quantidade
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }




  getProdutoById(id: number): Observable<BasicResponse<ProdutoElement>> {
    return this.http.get<BasicResponse<ProdutoElement>>(this.apiUrl + '/produtos/' + id, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
