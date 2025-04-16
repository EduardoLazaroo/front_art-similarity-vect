import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ImageSearchService } from './services/image-search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  results: any[] = [];
  loading = false;
  error: string | null = null;

  nomeArquivo: string = '';
  resultado: any = null;
  erro: string = '';

  constructor(private imageSearchService: ImageSearchService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Gera a visualização da imagem antes de enviar
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  upload(): void {
    if (!this.selectedFile) return;

    this.loading = true;
    this.error = null;
    this.results = [];
    this.previewUrl = this.previewUrl; // mantém preview

    this.imageSearchService.uploadImage(this.selectedFile).subscribe({
      next: (res) => {
        this.results = res.results || [];
        this.loading = false;

        // Buscar a imagem de cada resultado (isso é opcional, dependendo do back)
        this.results.forEach((result) => {
          this.buscarImagem(result.nome_arquivo);
        });
      },
      error: (err) => {
        this.error = err.error?.error || 'Erro ao buscar imagens semelhantes';
        this.loading = false;
      }
    });
  }

  buscarImagem(nomeArquivo: string): void {
    this.imageSearchService.buscarImagem(nomeArquivo).subscribe({
      next: (res) => {
        const result = this.results.find(r => r.nome_arquivo === nomeArquivo);
        if (result) {
          result.imagem = res;
        }
      },
      error: () => {
        const result = this.results.find(r => r.nome_arquivo === nomeArquivo);
        if (result) {
          result.erro = 'Erro ao buscar a imagem.';
        }
      }
    });
  }

  buscar(): void {
    if (!this.nomeArquivo) return;

    this.imageSearchService.buscarImagem(this.nomeArquivo).subscribe({
      next: (res) => {
        this.resultado = res;
        this.erro = '';
      },
      error: (err) => {
        this.resultado = null;
        this.erro = err.error?.erro || 'Erro desconhecido';
      }
    });
  }
}
