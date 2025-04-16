import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageSearchService {
  private API_URL = 'http://localhost:5000/api/search';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<any>(this.API_URL, formData);
  }

  buscarImagem(nomeArquivo: string): Observable<any> {
    return this.http.get(`${this.API_URL}/buscar-imagem/${nomeArquivo}`);
  }
}
